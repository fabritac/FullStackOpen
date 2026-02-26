```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://ejemplo.com
    activate server
    server-->>browser: HTML document
    deactivate server
```
