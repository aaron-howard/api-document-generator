/**
 * UML Generator Implementation
 * 
 * Generates UML diagrams in PlantUML and Mermaid formats from parsed documentation content.
 * Supports various diagram types including class diagrams, sequence diagrams, 
 * architecture diagrams, and flowcharts.
 */

import { GenerationRequest } from '../../cli/cli-service';

export interface UMLGeneratorOptions {
  format: 'plantuml' | 'mermaid';
  diagramType: 'class' | 'sequence' | 'architecture' | 'flowchart' | 'usecase';
  theme?: string;
  includeDetails?: boolean;
}

export class UMLGenerator {
  /**
   * Generate UML content based on documentation type and request
   */
  generate(request: GenerationRequest, options: UMLGeneratorOptions = { format: 'mermaid', diagramType: 'architecture' }): string {
    const inputType = request.inputs[0]?.type || 'api';
    
    switch (inputType) {
      case 'architecture':
        return this.generateArchitectureDiagram(request, options);
      case 'developer-guide':
        return this.generateDeveloperFlowDiagram(request, options);
      case 'api':
        return this.generateAPISequenceDiagram(request, options);
      case 'user-guide':
        return this.generateUserFlowDiagram(request, options);
      case 'security':
        return this.generateSecurityFlowDiagram(request, options);
      case 'monitoring':
        return this.generateMonitoringFlowDiagram(request, options);
      default:
        return this.generateGenericDiagram(request, options);
    }
  }

  /**
   * Generate architecture diagram
   */
  private generateArchitectureDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLArchitecture(request);
    } else {
      return this.generateMermaidArchitecture(request);
    }
  }

  /**
   * Generate PlantUML architecture diagram
   */
  private generatePlantUMLArchitecture(request: GenerationRequest): string {
    const projectName = request.project.name;
    
    return `@startuml ${projectName} Architecture
!theme plain

title ${projectName} - System Architecture

package "Frontend" {
  [Web Application]
  [Mobile App]
  [Admin Dashboard]
}

package "API Gateway" {
  [Load Balancer]
  [API Gateway]
  [Authentication]
}

package "Backend Services" {
  [User Service]
  [Product Service]
  [Order Service]
  [Payment Service]
}

package "Data Layer" {
  database "User Database" {
    [User Tables]
  }
  database "Product Database" {
    [Product Tables]
  }
  database "Order Database" {
    [Order Tables]
  }
}

package "External Services" {
  [Payment Gateway]
  [Email Service]
  [File Storage]
}

' Frontend connections
[Web Application] --> [Load Balancer]
[Mobile App] --> [Load Balancer]
[Admin Dashboard] --> [Load Balancer]

' API Gateway connections
[Load Balancer] --> [API Gateway]
[API Gateway] --> [Authentication]

' Service connections
[API Gateway] --> [User Service]
[API Gateway] --> [Product Service]
[API Gateway] --> [Order Service]
[API Gateway] --> [Payment Service]

' Database connections
[User Service] --> [User Tables]
[Product Service] --> [Product Tables]
[Order Service] --> [Order Tables]

' External service connections
[Payment Service] --> [Payment Gateway]
[User Service] --> [Email Service]
[Product Service] --> [File Storage]

note right of [API Gateway]
  Handles routing,
  authentication,
  and rate limiting
end note

note right of [User Service]
  Manages user accounts,
  profiles, and authentication
end note

note right of [Product Service]
  Handles product catalog,
  inventory, and search
end note

@enduml`;
  }

  /**
   * Generate Mermaid architecture diagram
   */
  private generateMermaidArchitecture(request: GenerationRequest): string {
    const projectName = request.project.name;
    
    return `graph TB
    subgraph "${projectName} - System Architecture"
    subgraph "Frontend Layer"
        WA[Web Application]
        MA[Mobile App]
        AD[Admin Dashboard]
    end
    
    subgraph "API Gateway"
        LB[Load Balancer]
        AG[API Gateway]
        AUTH[Authentication]
    end
    
    subgraph "Backend Services"
        US[User Service]
        PS[Product Service]
        OS[Order Service]
        PAYS[Payment Service]
    end
    
    subgraph "Data Layer"
        UDB[(User Database)]
        PDB[(Product Database)]
        ODB[(Order Database)]
    end
    
    subgraph "External Services"
        PG[Payment Gateway]
        ES[Email Service]
        FS[File Storage]
    end
    
    WA --> LB
    MA --> LB
    AD --> LB
    LB --> AG
    AG --> AUTH
    AG --> US
    AG --> PS
    AG --> OS
    AG --> PAYS
    US --> UDB
    PS --> PDB
    OS --> ODB
    PAYS --> PG
    US --> ES
    PS --> FS
    
    classDef frontend fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef service fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef external fill:#fce4ec
    
    class WA,MA,AD frontend
    class LB,AG,AUTH gateway
    class US,PS,OS,PAYS service
    class UDB,PDB,ODB database
    class PG,ES,FS external`;
  }

  /**
   * Generate developer flow diagram
   */
  private generateDeveloperFlowDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLDeveloperFlow(request);
    } else {
      return this.generateMermaidDeveloperFlow(request);
    }
  }

  /**
   * Generate PlantUML developer flow
   */
  private generatePlantUMLDeveloperFlow(_request: GenerationRequest): string {
    return `@startuml Developer Workflow
!theme plain

title Developer Workflow

start

:Clone Repository;
:Install Dependencies;
:Read Documentation;

if (First Time Setup?) then (yes)
  :Configure Environment;
  :Set up IDE;
  :Run Initial Tests;
else (no)
  :Pull Latest Changes;
endif

:Create Feature Branch;
:Write Code;
:Write Tests;
:Run Tests;

if (Tests Pass?) then (yes)
  :Commit Changes;
  :Push to Remote;
  :Create Pull Request;
  
  if (Code Review Approved?) then (yes)
    :Merge to Main;
    :Deploy to Staging;
    :Run Integration Tests;
    
    if (Integration Tests Pass?) then (yes)
      :Deploy to Production;
      stop
    else (no)
      :Fix Issues;
      :Redeploy;
    endif
  else (no)
    :Address Review Comments;
    :Update Pull Request;
  endif
else (no)
  :Fix Test Failures;
  :Re-run Tests;
endif

@enduml`;
  }

  /**
   * Generate Mermaid developer flow
   */
  private generateMermaidDeveloperFlow(_request: GenerationRequest): string {
    return `flowchart TD
    A[Clone Repository] --> B[Install Dependencies]
    B --> C[Read Documentation]
    C --> D{First Time Setup?}
    D -->|Yes| E[Configure Environment]
    D -->|No| F[Pull Latest Changes]
    E --> G[Set up IDE]
    G --> H[Run Initial Tests]
    H --> I[Create Feature Branch]
    F --> I
    I --> J[Write Code]
    J --> K[Write Tests]
    K --> L[Run Tests]
    L --> M{Tests Pass?}
    M -->|No| N[Fix Test Failures]
    N --> L
    M -->|Yes| O[Commit Changes]
    O --> P[Push to Remote]
    P --> Q[Create Pull Request]
    Q --> R{Code Review Approved?}
    R -->|No| S[Address Review Comments]
    S --> Q
    R -->|Yes| T[Merge to Main]
    T --> U[Deploy to Staging]
    U --> V[Run Integration Tests]
    V --> W{Integration Tests Pass?}
    W -->|No| X[Fix Issues]
    X --> U
    W -->|Yes| Y[Deploy to Production]
    
    classDef startEnd fill:#4caf50,color:#fff
    classDef process fill:#2196f3,color:#fff
    classDef decision fill:#ff9800,color:#fff
    classDef error fill:#f44336,color:#fff
    
    class A,Y startEnd
    class B,C,E,F,G,H,I,J,K,L,O,P,Q,T,U,V process
    class D,M,R,W decision
    class N,S,X error`;
  }

  /**
   * Generate API sequence diagram
   */
  private generateAPISequenceDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLAPISequence(request);
    } else {
      return this.generateMermaidAPISequence(request);
    }
  }

  /**
   * Generate PlantUML API sequence diagram
   */
  private generatePlantUMLAPISequence(_request: GenerationRequest): string {
    return `@startuml API Request Flow
!theme plain

title API Request Flow

actor User
participant "Frontend" as FE
participant "API Gateway" as AG
participant "Auth Service" as AUTH
participant "Business Service" as BS
participant "Database" as DB

User -> FE: Make Request
FE -> AG: HTTP Request
AG -> AUTH: Validate Token
AUTH --> AG: Token Valid
AG -> BS: Forward Request
BS -> DB: Query Data
DB --> BS: Return Data
BS --> AG: Response Data
AG --> FE: HTTP Response
FE --> User: Display Result

note over AG, AUTH
  Authentication and
  rate limiting
end note

note over BS, DB
  Business logic and
  data persistence
end note

@enduml`;
  }

  /**
   * Generate Mermaid API sequence diagram
   */
  private generateMermaidAPISequence(_request: GenerationRequest): string {
    return `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant Auth as Auth Service
    participant B as Business Service
    participant D as Database
    
    U->>F: Make Request
    F->>A: HTTP Request
    A->>Auth: Validate Token
    Auth-->>A: Token Valid
    A->>B: Forward Request
    B->>D: Query Data
    D-->>B: Return Data
    B-->>A: Response Data
    A-->>F: HTTP Response
    F-->>U: Display Result
    
    Note over A,Auth: Authentication and rate limiting
    Note over B,D: Business logic and data persistence`;
  }

  /**
   * Generate user flow diagram
   */
  private generateUserFlowDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLUserFlow(request);
    } else {
      return this.generateMermaidUserFlow(request);
    }
  }

  /**
   * Generate PlantUML user flow
   */
  private generatePlantUMLUserFlow(_request: GenerationRequest): string {
    return `@startuml User Journey
!theme plain

title User Journey Flow

start

:User visits application;
:View landing page;

if (User registered?) then (no)
  :Click Sign Up;
  :Fill registration form;
  :Submit registration;
  :Verify email;
  :Complete profile setup;
else (yes)
  :Click Sign In;
  :Enter credentials;
endif

:Access dashboard;
:Browse features;

if (Feature available?) then (yes)
  :Use feature;
  :Provide feedback;
else (no)
  :Contact support;
endif

:Logout;
stop

@enduml`;
  }

  /**
   * Generate Mermaid user flow
   */
  private generateMermaidUserFlow(_request: GenerationRequest): string {
    return `flowchart TD
    A[User visits application] --> B[View landing page]
    B --> C{User registered?}
    C -->|No| D[Click Sign Up]
    C -->|Yes| E[Click Sign In]
    D --> F[Fill registration form]
    F --> G[Submit registration]
    G --> H[Verify email]
    H --> I[Complete profile setup]
    I --> J[Access dashboard]
    E --> J
    J --> K[Browse features]
    K --> L{Feature available?}
    L -->|Yes| M[Use feature]
    L -->|No| N[Contact support]
    M --> O[Provide feedback]
    O --> P[Logout]
    N --> P
    
    classDef start fill:#4caf50,color:#fff
    classDef process fill:#2196f3,color:#fff
    classDef decision fill:#ff9800,color:#fff
    classDef end fill:#9c27b0,color:#fff
    
    class A start
    class B,D,E,F,G,H,I,J,K,M,N,O process
    class C,L decision
    class P end`;
  }

  /**
   * Generate security flow diagram
   */
  private generateSecurityFlowDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLSecurityFlow(request);
    } else {
      return this.generateMermaidSecurityFlow(request);
    }
  }

  /**
   * Generate PlantUML security flow
   */
  private generatePlantUMLSecurityFlow(_request: GenerationRequest): string {
    return `@startuml Security Flow
!theme plain

title Security Authentication Flow

actor User
participant "Frontend" as FE
participant "API Gateway" as AG
participant "Auth Service" as AUTH
participant "User Database" as UDB

User -> FE: Login Request
FE -> AG: POST /auth/login
AG -> AUTH: Validate Credentials
AUTH -> UDB: Check User Credentials
UDB --> AUTH: User Data
AUTH --> AG: JWT Token
AG --> FE: Token Response
FE -> FE: Store Token
FE -> AG: API Request with Token
AG -> AUTH: Validate Token
AUTH --> AG: Token Valid
AG -> AG: Process Request
AG --> FE: API Response

note over AUTH, UDB
  Secure credential validation
  and token generation
end note

@enduml`;
  }

  /**
   * Generate Mermaid security flow
   */
  private generateMermaidSecurityFlow(_request: GenerationRequest): string {
    return `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant Auth as Auth Service
    participant D as User Database
    
    U->>F: Login Request
    F->>A: POST /auth/login
    A->>Auth: Validate Credentials
    Auth->>D: Check User Credentials
    D-->>Auth: User Data
    Auth-->>A: JWT Token
    A-->>F: Token Response
    F->>F: Store Token
    F->>A: API Request with Token
    A->>Auth: Validate Token
    Auth-->>A: Token Valid
    A->>A: Process Request
    A-->>F: API Response
    
    Note over Auth,D: Secure credential validation and token generation`;
  }

  /**
   * Generate monitoring flow diagram
   */
  private generateMonitoringFlowDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return this.generatePlantUMLMonitoringFlow(request);
    } else {
      return this.generateMermaidMonitoringFlow(request);
    }
  }

  /**
   * Generate PlantUML monitoring flow
   */
  private generatePlantUMLMonitoringFlow(_request: GenerationRequest): string {
    return `@startuml Monitoring Flow
!theme plain

title System Monitoring Flow

participant "Application" as APP
participant "Metrics Collector" as MC
participant "Alert Manager" as AM
participant "Dashboard" as DASH
participant "Notification Service" as NS

APP -> MC: Send Metrics
MC -> MC: Process Metrics
MC -> DASH: Update Dashboard
MC -> AM: Check Thresholds

alt Threshold Exceeded
  AM -> NS: Send Alert
  NS -> NS: Notify Team
else Normal Operation
  AM -> AM: Continue Monitoring
endif

note over MC, AM
  Real-time monitoring
  and alerting system
end note

@enduml`;
  }

  /**
   * Generate Mermaid monitoring flow
   */
  private generateMermaidMonitoringFlow(_request: GenerationRequest): string {
    return `sequenceDiagram
    participant A as Application
    participant M as Metrics Collector
    participant AM as Alert Manager
    participant D as Dashboard
    participant N as Notification Service
    
    A->>M: Send Metrics
    M->>M: Process Metrics
    M->>D: Update Dashboard
    M->>AM: Check Thresholds
    
    alt Threshold Exceeded
        AM->>N: Send Alert
        N->>N: Notify Team
    else Normal Operation
        AM->>AM: Continue Monitoring
    end
    
    Note over M,AM: Real-time monitoring and alerting system`;
  }

  /**
   * Generate generic diagram for unknown types
   */
  private generateGenericDiagram(request: GenerationRequest, options: UMLGeneratorOptions): string {
    if (options.format === 'plantuml') {
      return `@startuml Generic Process
!theme plain

title ${request.project.name} - Process Flow

start
:Initialize Process;
:Process Data;
:Generate Output;
stop

@enduml`;
    } else {
      return `flowchart TD
    A[Initialize Process] --> B[Process Data]
    B --> C[Generate Output]
    
    classDef process fill:#2196f3,color:#fff
    class A,B,C process`;
    }
  }
}

export default UMLGenerator;
