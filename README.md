# 🛡️ IMSS-Intel Lab

**Orquestador de Identidad y Seguridad Social en México**

Laboratorio de ingeniería de datos desarrollado en **FastAPI** para la automatización, extracción y normalización de servicios críticos (**IMSS, SAT, RENAPO**). Este sistema actúa como un Gateway inteligente que transforma portales gubernamentales complejos en flujos de datos estructurados.

### 🧠 Orquestación de Salida (Decision Logic)
El núcleo del sistema integra un motor lógico que define el flujo de ejecución en tiempo real:
* **Generación Dinámica:** Evalúa si el trámite requiere un **PDF legal** (vía Selenium Print-to-PDF) o solo datos en **JSON**.
* **Optimización de Recursos:** Si el cliente solicita validación rápida, el orquestador omite la carga de elementos visuales pesados, reduciendo latencia y consumo de RAM.

### 🚀 Características Técnicas
* **Arquitectura Híbrida:** Soporte para respuestas síncronas y flujos asíncronos mediante Webhooks.
* **Normalización:** Validación estricta con **Pydantic v2** para asegurar la integridad de las cargas útiles.
* **Resiliencia:** Manejo de excepciones ante intermitencias en portales oficiales, garantizando la entrega de datos crudos.

### 🛠️ Stack Tecnológico
* **Backend:** Python 3.10+ / FastAPI / Uvicorn
* **Automatización:** Selenium WebDriver (Headless mode)
* **Cliente HTTP:** HTTPX (Asíncrono)
* **Validación:** Pydantic

### ⚖️ Licencia
Distribuido bajo la licencia **MIT**. Consulte el archivo `LICENSE` para más información.

---
Desarrollado con enfoque en OSINT y Enriquecimiento de Datos.
