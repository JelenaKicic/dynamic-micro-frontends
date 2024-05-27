# Dynamic Micro-Frontends

## Abstract
Economic and business demands for decreasing time to market and efficient production have influenced software development, leading to streamlined approaches and reusable components on both server and client sides. This project introduces a novel approach for dynamically using and deploying micro-frontends, synchronized with their respective microservices, applicable in both development and production stages.

## Key Features

- **Dynamic Configuration**: Real-time route and application management via Firestore database subscription.
- **Micro-Application Management**: Consistent sidebar integration of specific micro-applications across all routes.
- **Template Management**: Utilizes predefined templates for dynamic route creation.
- **Web Component Framework**: Facilitates the creation and integration of web components, enabling the loading of external applications within these components.
- **Data-Driven Presentation**: Ensures application validity and functionality through a data repository.

## Technology Stack

- **Frontend**: Vue.js for dynamic route management and template generation.
- **Backend**: Firestore for real-time data synchronization.
- **Web Components**: Custom elements, Shadow DOM, and HTML templates for encapsulated, reusable components.

## Installation

To set up the UI Orchestrator locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/IcETRAN-dynamic-micro-frontends.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd ui-orchestrator
    ```
3. **Add Firestore config**:
    ```json
   ui-orchestrator/src/firebase/config.json
    {
        "apiKey": "",
        "authDomain": "",
        "projectId": "",
        "storageBucket": "",
        "messagingSenderId": "",
        "appId": ""
    }
    ```

4. **Install dependencies**:
    ```bash
    pnpm install
    ```

5. **Run the application**:
    ```bash
    pnpm dev
    ```

## Usage

The UI Orchestrator subscribes to a Firestore database and configures itself dynamically based on received data. It manages routes and applications, ensuring a responsive and up-to-date user interface.

### Example Configuration

- **Route Configuration**:
    ```json
    {
        "raspored-nastave": {
            "linkName": "Raspored Nastave",
            "apps": ["class-schedule"]
        }
    }
    ```

- **Micro-Frontend Application Configuration**:
    ```json
    {
        "class-schedule": {
            "name": "micro-class-schedule",
            "position": "center",
            "route": "raspored-nastave",
            "css": ["/static/css/main.f855e6bc.css"],
            "js": ["/static/js/main.839b9d4c.js"],
            "webComponentPrecompiled": "false"
        }
    }
    ```

## Architecture Overview

The system is composed of three main parts:
1. **Single-Page Application (SPA)**: Manages UI orchestration.
2. **External Repository**: Contains deployment data and micro-frontend applications.
3. **Micro-Frontend Applications**: Independent applications that can function standalone or integrate into the UI orchestrator.

### Implementation Details

- **Horizontal Split**: Multiple micro-frontends in the same view.
- **Web Components**: Utilize Custom Elements, Shadow DOM, and HTML templates for encapsulation and reusability.
- **Real-Time Updates**: Firestore enables dynamic updates of micro-frontend applications without redeployment.

