---
layout: post
title: "OutSystems O11 인프라 아키텍처 종합 기술 문서"
date: 2026-04-07 19:59:00 +0900
tags: [로우코드, 기업IT, 개발]
description: "Windows Server + IIS + .NET 기반 O11의 배포 모델, AWS 아키텍처, HA/DR 패턴, 포트 구성, 스케일링 전략까지 Technical Architect를 위한 인프라 설계 완전 가이드."
---

OutSystems 11(이하 O11)은 **Windows Server + IIS + .NET Framework 기반의 전통적인 VM 아키텍처** 위에서 동작하는 로우코드 플랫폼이다. 컨테이너나 Kubernetes를 사용하지 않으며, OutSystems Cloud(AWS 호스팅), 퍼블릭 클라우드 셀프 매니지드, On-Premises 세 가지 배포 모델을 지원한다. 프론트엔드 서버의 수평 확장(Scale-out), RDS 기반 데이터베이스, RabbitMQ 캐시 무효화 서비스가 핵심 아키텍처 구성 요소이며, 프로덕션 환경에서는 **팜(Farm) 구성을 통한 Active-Active 다중 프론트엔드 + 로드밸런서** 토폴로지가 권장된다. 이 문서는 Technical Architect가 인프라 설계 시 참조할 수 있도록 모든 구성 요소의 사양, 포트, HA/DR 패턴, 스케일링 전략을 정리한다.

---

## 1. O11 플랫폼 개요와 세 가지 배포 모델

### 배포 옵션 비교

O11은 세 가지 배포 모델을 제공하며, 각 모델의 관리 책임 범위가 명확히 구분된다.

| 구분 | OutSystems Cloud | 셀프 매니지드 (AWS/Azure) | On-Premises |
|------|-----------------|------------------------|-------------|
| **인프라 관리** | OutSystems | 고객 | 고객 |
| **OS/IIS 관리** | OutSystems | 고객 | 고객 |
| **DB 관리** | OutSystems | 고객 | 고객 |
| **플랫폼 업데이트** | 자동 (OutSystems) | 수동 (고객) | 수동 (고객) |
| **스케일링** | OutSystems 관리 | 고객 관리 | 고객 관리 |
| **기반 인프라** | AWS 전용 | AWS, Azure 등 | 물리/가상 서버 |

**OutSystems Cloud**는 AWS 위에서 운영되며, 고객마다 **전용 VPC**가 할당된다. AWS Security Group이 방화벽 역할을 하고, **WAF(Web Application Firewall)**가 각 환경을 보호한다. 고가용성 옵션을 구독하면 프론트엔드 서버가 서로 다른 **AWS Availability Zone**에 배치되고, 프로덕션 데이터베이스에는 다른 AZ의 스탠바이 레플리카가 자동 구성된다.

**셀프 매니지드** 배포는 AWS EC2, Azure VM 등 퍼블릭 클라우드 IaaS 위에 고객이 직접 플랫폼을 설치·운영한다. AWS Marketplace에서 **CloudFormation 템플릿**을 제공하여 4개 환경(LifeTime, Development, Test, Production) 팩토리를 자동 배포할 수 있다. GCP는 O11 공식 문서에서 명시적으로 언급되지 않는다.

**On-Premises** 배포는 베어메탈 또는 하드웨어 가상화(VMware, KVM) 환경에서 설치하며, 고객이 모든 인프라 구성 요소를 완전히 제어한다.

### 클라우드 네이티브 여부

**O11은 클라우드 네이티브가 아니다.** 컨테이너, Kubernetes, 마이크로서비스 아키텍처를 사용하지 않으며, Windows Server VM 위의 IIS에서 **.NET Framework 4.7.2/4.8** 기반 애플리케이션으로 실행된다. 이는 클라우드 네이티브 아키텍처(Kubernetes, Linux 컨테이너, Aurora PostgreSQL)를 사용하는 **ODC(OutSystems Developer Cloud)**와 근본적으로 다르다. O11은 "클라우드 호스팅(cloud-hosted)" 또는 "클라우드 레디(cloud-ready)"로 분류하는 것이 정확하다.

| 특성 | O11 | ODC |
|------|-----|-----|
| 아키텍처 | 전통적 VM/IIS 기반 | Kubernetes/컨테이너 기반 |
| 런타임 | .NET Framework (Windows) | 클라우드 네이티브 (Linux) |
| 데이터베이스 | SQL Server, Oracle, Azure SQL | AWS Aurora PostgreSQL |
| 스케일링 | 수동 수평 확장 | Kubernetes 자동 스케일링 |

---

## 2. AWS 기반 인프라 아키텍처 상세

### 서버 역할별 권장 EC2 인스턴스 사양

O11 AWS 배포에서 서버는 **Front-End Server**, **Deployment Controller**, **Database(RDS)** 세 가지 역할로 구분된다. OutSystems 공식 문서는 특정 EC2 인스턴스 패밀리를 명시적으로 지정하지 않고 최소 CPU/RAM을 기준으로 권장하며, 아래는 워크로드 프로파일 기반의 권장 사양이다.

| 역할 | 권장 인스턴스 | vCPU | 메모리 | 비고 |
|------|-------------|------|--------|------|
| **Front-End (프로덕션)** | m5.xlarge ~ m5.2xlarge | 4~8 | 16~32 GB | Mobile/Reactive 앱 기준 4 vCPU/16 GB에서 **~750 req/s** 처리 |
| **Front-End (비프로덕션)** | t3.large ~ t3.xlarge | 2~4 | 8~16 GB | 버스터블 인스턴스로 비용 효율적 운영 |
| **Deployment Controller** | m5.xlarge ~ m5.2xlarge | 4~8 | 16~32 GB | 코드 컴파일이 CPU 집약적; 개발자 **16명 이상** 시 전용 서버 권장 |
| **RDS (프로덕션)** | db.m5.large ~ db.r5.xlarge | 2~4 | 8~32 GB | 최소 **1 vCPU** (db.t2.medium 이상) |
| **RDS (비프로덕션)** | db.t3.medium | 2 | 4 GB | 비프로덕션 환경은 공유 인스턴스 가능 |

디스크는 최소 **20 GB** 이상의 여유 공간이 필요하며, EBS **gp3** 볼륨이 기본 권장, 고 IOPS 요구 시 **io1/io2**를 사용한다. 프로덕션에서는 버스터블 T 시리즈 인스턴스를 피하고 **M5 패밀리**를 사용하는 것이 성능 일관성 면에서 바람직하다.

### VPC 네트워크 아키텍처와 로드밸런서

AWS 배포의 표준 네트워크 구성은 다음과 같다.

**VPC 구성**: CloudFormation 템플릿 기준 **/24 CIDR 블록** 하나로 4개 환경 전체를 배포한다. 베스트 프랙티스 아키텍처에서는 애플리케이션 서버를 **프라이빗 서브넷**에, 로드밸런서를 **퍼블릭 서브넷**에 배치하고, 아웃바운드 인터넷 접근을 위해 **NAT Gateway**를 구성한다.

**로드밸런서**: 프로덕션 환경에서 **ALB(Application Load Balancer)**가 권장된다. OutSystems는 Layer 4와 Layer 7 모두 지원하지만, 트래픽을 변조하지 않는 로드밸런서를 **강력히 권장**한다. 중요한 점은 **스티키 세션이 불필요**하다는 것이다. O11은 세션 데이터를 **중앙 세션 데이터베이스**에 저장하므로, 어떤 프론트엔드 서버든 사용자 요청을 처리할 수 있다.

**Auto Scaling**: 프로덕션 환경을 **팜(Farm) 모드**로 배포하면 수평 확장이 가능하다. AWS Auto Scaling Group이 새 EC2 인스턴스를 시작하면, **OutSystems.SetupTools PowerShell 모듈**이 자동으로 플랫폼을 설치하고 프론트엔드를 등록한 뒤 로드밸런서 타겟 그룹에 추가한다.

### RDS 구성 및 AWS 서비스 연계

**Amazon RDS는 O11에서 공식 지원**되며, CloudFormation 템플릿의 기본 데이터베이스 구성이다. 지원하는 RDS 엔진은 SQL Server(2016, 2017, 2019)와 Oracle(12c, 18c, 19c)이며, **Developer/Express 에디션은 미지원**이다. Multi-AZ 배포를 지원하며, 프로덕션에서는 **전용 RDS 인스턴스**를 권장한다. 플랫폼, 로그, 세션 세 개 데이터베이스 카탈로그 모두 **동일한 DB 엔진**을 사용해야 한다.

AWS 서비스 연계 현황:
- **S3**: 프로덕션 팜 구성에서 프론트엔드 서버 간 **파일 교환**에 사용. IAM Role/Policy로 접근 제어
- **Secrets Manager**: DB 관리자 패스워드, SQL 사용자 패스워드, 플랫폼 관리자 패스워드 저장
- **CloudWatch**: EC2, RDS 인스턴스의 표준 모니터링. IAM Role을 통한 RDS Enhanced Monitoring 지원
- **Direct Connect / Transit Gateway**: OutSystems Cloud VPC와 온프레미스 네트워크 연결(1 Gbps / 10 Gbps)
- **WAF**: OutSystems Cloud 환경에 기본 적용, 악성 트래픽 차단

### 표준 4환경 팩토리 토폴로지

| 환경 | EC2 인스턴스 | 데이터베이스 | 로드밸런서 | 용도 |
|------|------------|------------|-----------|------|
| **LifeTime** | 1대 (Windows Server 2022) | 공유 RDS | 없음 | 인프라 관리 콘솔 |
| **Development** | 1대 | 공유 RDS | 없음 | 개발 |
| **Test/QA** | 1대 | 공유 RDS | 없음 | 테스트 |
| **Production** | 2대 이상 | 전용 RDS | ALB | 운영 |

---

## 3. On-Premises 인프라 아키텍처와 서버 역할 구분

### 서버 역할 정의

**Front-End Server**: IIS를 통해 웹/모바일 애플리케이션을 서비스. Deployment Service(포트 12001)로 배포 패키지 수신, Scheduler Service(포트 12002)로 Timer/BPT 실행. 수평 확장 가능한 유일한 역할.

**Deployment Controller Server**: 코드 컴파일과 배포 담당, 환경당 **정확히 1대**. 1-Click Publish 시 컴파일 후 모든 프론트엔드에 패키지 배포. **개발자 16명 이상** 시 전용 서버 분리 권장.

**RabbitMQ Server**: 캐시 무효화 서비스(Cache Invalidation Service) 제공. Pub/Sub 패턴으로 다중 프론트엔드 간 캐시 일관성 유지. 기본적으로 DC 서버에 설치.

**LifeTime Server**: 전 환경 중앙 관리 콘솔. 반드시 전용 환경에서 실행, 팜 구성 미지원.

### 권장 서버 사양

| 역할 | 규모 | CPU 코어 | RAM | 디스크 | 처리량 참고 |
|------|------|---------|-----|--------|------------|
| **Front-End** (비프로덕션) | Small | 2 | 4 GB | 80 GB+ | ~20 req/s |
| **Front-End** (프로덕션) | Medium | 4 | 12~16 GB | 80 GB+ (SSD) | ~40 req/s |
| **Front-End** (프로덕션 대규모) | Large | 8 | 16~32 GB | 120 GB+ (SSD) | ~80 req/s |
| **Deployment Controller** (전용) | - | 4~8 | 16~32 GB | 80 GB+ | 16+ 개발자 시 전용 분리 |
| **Database** (비프로덕션 공유) | Small | 2 | 8 GB | 100 GB+ | Dev/Test 공유 |
| **Database** (프로덕션 전용) | Medium | 4 | 16 GB | 200~500 GB+ | 환경당 전용 |
| **Database** (프로덕션 대규모) | Large | 8+ | 32+ GB | 500 GB+ | HA 클러스터링 |
| **LifeTime** | - | 4 | 8 GB | 80 GB+ | 전용 환경 |

---

## 4. OS 및 소프트웨어 종속성 매트릭스

### 지원 운영체제

| OS 버전 | 에디션 | 지원 시작 Platform Server 버전 |
|---------|--------|------------------------------|
| **Windows Server 2022** | Standard 이상 | Platform Server **11.20.0** |
| **Windows Server 2019** | Standard 이상 | Platform Server **Release Jul.2019** |
| **Windows Server 2016** | Standard 이상 | O11 최초 릴리스부터 |

**Linux는 O11에서 지원되지 않는다.** O11 Platform Server는 Windows 전용이며, Docker/컨테이너 환경은 지원하지 않는다.

### 필수 소프트웨어

| 소프트웨어 | 버전 | 비고 |
|-----------|------|------|
| **.NET Framework** | **4.8** (권장) / 4.7.2 (최소) | PS 11 Release Oct.2019 CP2부터 4.8 지원 |
| **.NET Core Windows Server Hosting** | **2.1** | Reactive Web 앱 런타임에 필수 |
| **IIS** | **10.0** 이상 | 유효한 공인 CA 발급 SSL 인증서 필수 |
| **Oracle Data Provider for .NET** | Managed driver **19.3.1** | Oracle DB 연결 시 필요 |

### RabbitMQ 및 Erlang 버전 매트릭스

| Platform Server 버전 | RabbitMQ Server | Erlang |
|----------------------|-----------------|--------|
| **11.15.0 이상** | **3.9.11** | **24.2** |
| 11.13.2 ~ 11.14.1 | 3.8.21 | 23.2 |
| 11.9.0 ~ 11.13.1 | 3.8.3 | 22.3 |
| 11.9.0 미만 | 3.7.7 | 20.3 |

### 데이터베이스 지원 매트릭스

| 데이터베이스 | 버전 | 에디션 |
|-------------|------|--------|
| **SQL Server 2022** | Compat Level 160 | Web 이상 |
| **SQL Server 2019** | Compat Level 150 | Web 이상 |
| **SQL Server 2017/2016/2014** | - | Web 이상 |
| **Oracle 19c/18c** | - | Standard/Enterprise |
| **Oracle 12c** (12.1/12.2) | - | Standard/Enterprise |
| **Azure SQL Database** | V12 | 서비스 티어 **S3** 이상 |

주요 제약: SQL Server Developer/Express 미지원, PostgreSQL은 외부 DB 연결(PS 11.15.0+)로만 지원.

---

## 5. 고가용성(HA) 및 재해복구(DR) 아키텍처

### Active-Active 멀티 프론트엔드 구성

O11의 HA 핵심은 **Active-Active 프론트엔드 서버 팜**이다. 세션 데이터가 중앙 DB에 저장되므로 **스티키 세션 없이** 어떤 서버든 요청을 처리할 수 있다. 새 프론트엔드 추가 시 DC가 **자동으로 모든 애플리케이션을 배포**한다.

### 데이터베이스 이중화

| 기술 | 유형 | 지원 여부 | 설명 |
|------|------|----------|------|
| **SQL Server Always On AG** | Active-Passive | ✅ | 자동 장애 조치 |
| **SQL Server Failover Clustering** | Active-Passive | ✅ | 단일 인스턴스로 표현 |
| **Oracle RAC** | Active-Active | ✅ | 수평 확장 DB 클러스터링 |
| **Oracle Data Guard** | Standby/DR | ✅ | 스탠바이 DB |
| **RDS Multi-AZ** | Active-Passive | ✅ | **1~2분 내 자동 장애 조치** |

### 단일 장애점(SPOF) 분석

| 구성 요소 | SPOF 여부 | 장애 시 영향 | 대응 방안 |
|----------|----------|------------|----------|
| Front-End Server | ❌ (팜 구성 시) | 다른 서버가 트래픽 처리 | 멀티 FE + LB |
| Deployment Controller | ⚠️ 퍼블리싱 SPOF | 배포 불가, 캐시 무효화 중단 | DC 역할 마이그레이션 |
| RabbitMQ | ⚠️ 기본 구성 시 | 캐시 무효화 중단 | 클러스터 + TCP LB |
| Database | ⚠️ 단일 구성 시 | 전체 서비스 중단 | Always On / RAC / Multi-AZ |
| Load Balancer | ⚠️ 단일 구성 시 | 외부 접근 불가 | LB HA 구성 |

OutSystems Cloud SLA: 프로덕션 환경 월간 가용성 **99.5% 이상**, 비프로덕션 RTO/RPO **24시간**.

---

## 6. 네트워크 포트 및 보안 구성

### 필수 개방 포트 (인바운드)

| 포트 | 프로토콜 | 대상 서버 | 소스 | 용도 |
|------|---------|----------|------|------|
| **80** | HTTP/TCP | Front-End, DC | 사용자, LB | 앱 HTTP, Service Center |
| **443** | HTTPS/TCP | Front-End, DC | 사용자, LB, LifeTime | 앱 HTTPS, 플랫폼 보안 통신 |
| **1433** | TCP | Database | 모든 Platform Server | SQL Server 연결 |
| **1521** | TCP | Database | 모든 Platform Server | Oracle 연결 |
| **5672** | TCP (AMQP) | RabbitMQ | 모든 FE, DC | 캐시 무효화 (비TLS) |
| **5671** | TCP (AMQPS) | RabbitMQ | 모든 FE, DC | 캐시 무효화 (TLS) |
| **15672** | TCP (HTTP) | RabbitMQ | 관리자 | RabbitMQ Management Console |
| **4369** | TCP | RabbitMQ 클러스터 | 노드 간 | Erlang epmd |
| **25672** | TCP | RabbitMQ 클러스터 | 노드 간 | 노드 간 통신 |
| **12000** | TCP | DC | DC 서버 localhost | Deployment Controller Service |
| **12001** | TCP | Front-End | DC | Deployment Service |
| **12002** | TCP | Front-End | FE 서버 localhost | Scheduler Service |

---

## 7. 성능 최적화와 스케일링 전략

### 수평/수직 확장 가능 여부

| 구성 요소 | Scale-out | Scale-up | 비고 |
|----------|-----------|----------|------|
| **Front-End Server** | ✅ | ✅ | 팜에 FE 추가, LB 뒤 배치 |
| **Database** | ❌ | ✅ | 수직 확장만 가능 |
| **Deployment Controller** | ❌ | ✅ | 환경당 1대 고정 |
| **LifeTime** | ❌ | ✅ | 단일 서버 |
| **RabbitMQ** | ✅ | ✅ | HA 목적 클러스터링 |
| **Session Storage (Redis)** | ✅ | ✅ | Redis Cluster 3노드 |

### 캐싱 전략 3계층

**인프로세스(로컬) 캐시**: 각 FE 서버 메모리에 저장. "Cache in Minutes" 속성으로 설정. FE 1~2대 환경에 적합.

**분산 캐시(Redis)**: FE 3대 이상 시 도입. Forge의 RedisCacheSentinel 컴포넌트 활용. 프로덕션은 3노드 Master/Replica 클러스터 권장.

**클라이언트 사이드 캐시**: Mobile/Reactive 앱에서 IndexedDB 활용. Sync Unit 기반 캐시 타임아웃 관리.

### 핵심 성능 병목 해결

| 성능 병목 | 해결 방안 |
|----------|----------|
| 세션 DB 부하 | Redis 인메모리 세션 스토리지 전환 |
| 단일 FE 과부하 | 프론트엔드 수평 확장 |
| 멀티 FE 캐시 불일치 | 분산 캐시(Redis) 도입 |
| 컴파일 지연 | DC 전용 서버 분리 |
| DB 쿼리 성능 저하 | Cache in Minutes, 쿼리 최적화, DB 수직 확장 |
| 커넥션 풀 고갈 | 적정 min/max 풀 크기 설정 |
| 캐시 무효화 중단 | RabbitMQ 클러스터 + TCP LB |

---

## 결론: 아키텍처 설계 핵심 의사결정 가이드

O11 인프라 설계에서 Technical Architect가 내려야 할 핵심 결정은 세 가지다. **첫째, 배포 모델 선택**: OutSystems Cloud는 운영 부담 최소화, 셀프 매니지드는 완전한 제어권 확보. **둘째, 프로덕션 팜 토폴로지 설계**: FE 서버 수는 예상 트래픽(4 vCPU/16 GB 기준 750 req/s) 기준 산정, DC와 RabbitMQ의 SPOF 해소 필수. **셋째, 데이터베이스 전략**: DB는 수직 확장만 가능하므로 초기 사이징을 넉넉히 하고, SQL Server Always On 또는 RDS Multi-AZ로 가용성 확보.

O11은 2029년 3월까지 지원이 보장되지만, ODC로의 마이그레이션이 장기 로드맵이므로 신규 인프라 투자 시 이 타임라인을 반드시 고려해야 한다.
