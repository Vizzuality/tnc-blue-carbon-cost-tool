# Computations Microservice Proxy Configuration

## 📦 Purpose
This service acts as a proxy between the main NestJS backend and a FastAPI microservice. All communication with the microservice is internal (not exposed to the internet).

---

## 🌐 Environment Variables

### `COMPUTATIONS_MICROSERVICE_URL`

> Base URL where the FastAPI microservice can be reached by the NestJS app.
> This variable is defined in the `shared/config/.env` file.


| Environment        | Value                           | Notes                                                   |
|--------------------|---------------------------------|---------------------------------------------------------|
| Local (no Docker)  | `http://localhost:8000`         | Microservice runs locally outside Docker                |
| Docker Compose     | `http://microservice-name:8000` | Use the service name defined in `docker-compose.yml`   |
| Elastic Beanstalk  | `http://<internal-name>:8000`   | Depends on container network and DNS                   |

---

## ✅ Usage in NestJS

> If not defined, the main NestJS backend will crash.

This variable is used by the `MicroserviceProxyService` to send requests to the FastAPI service:

```ts
const response = await this.httpService.post(
  \`\${process.env.MICROSERVICE_BASE_URL}/your-endpoint\`,
  dto,
);