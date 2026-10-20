# Dynamic Micro-Frontends

## Abstract
Economic and business demands for decreasing time to market and efficient production have influenced software development, leading to streamlined approaches and reusable components on both server and client sides. This project introduces a novel approach for dynamically using and deploying micro-frontends, synchronized with their respective microservices, applicable in both development and production stages.

## Key Features

- **Dynamic Configuration**: Real-time route and application management via a live stream from the Core Registry backend.
- **Micro-Application Management**: Consistent sidebar integration of specific micro-applications across all routes.
- **Template Management**: Utilizes predefined templates for dynamic route creation.
- **Web Component Framework**: Facilitates the creation and integration of web components, enabling the loading of external applications within these components.
- **Data-Driven Presentation**: Ensures application validity and functionality through a central configuration store.
- **A/B Testing**: Routes can have several versions split by percentage, with each visitor assigned a stable version.

## Technology Stack

- **Frontend**: Vue.js for dynamic route management and template generation.
- **Backend**: Core Registry built with FastAPI, storing configuration in a database (SQLAlchemy, migrated with Alembic) and streaming changes over Server-Sent Events.
- **Web Components**: Custom elements, Shadow DOM, and HTML templates for encapsulated, reusable components.

## Installation

To set up the system locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/dynamic-micro-frontends.git
    ```

2. **Start the Core Registry backend**:
    ```bash
    cd core-registry
    pip install -r requirements.txt
    alembic upgrade head
    python seed.py        # optional sample data
    fastapi dev main.py
    ```

3. **Start the UI Orchestrator**:
    ```bash
    cd ui-orchestrator
    pnpm install
    pnpm dev
    ```

## Usage

The UI Orchestrator connects to the Core Registry over a live stream and configures itself dynamically based on the received data. It manages routes and applications, ensuring a responsive and up-to-date user interface.

### Example Configuration

- **Route Configuration**:
    ```json
    {
        "link": "/raspored-nastave",
        "name": "Raspored Nastave",
        "apps": ["class-schedule"]
    }
    ```

- **Micro-Frontend Application Configuration**:
    ```json
    {
        "name": "micro-class-schedule",
        "position": "center",
        "css": ["/static/css/main.f855e6bc.css"],
        "js": ["/static/js/main.839b9d4c.js"]
    }
    ```

## Architecture Overview

The system is composed of three main parts:
1. **Single-Page Application (SPA)**: Manages UI orchestration.
2. **Data Repository**: Contains deployment data and micro-frontend applications.
3. **Micro-Frontend Applications**: Independent applications that can function standalone or integrate into the UI orchestrator.

### Implementation Details

- **Horizontal Split**: Multiple micro-frontends in the same view.
- **Web Components**: Utilize Custom Elements, Shadow DOM, and HTML templates for encapsulation and reusability.
- **Real-Time Updates**: System enables dynamic updates of micro-frontend applications without redeployment.

