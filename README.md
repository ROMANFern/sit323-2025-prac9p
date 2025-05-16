# SIT323 Task 9.1P: Adding MongoDB to a Node.js Application

## Overview

This project demonstrates how to integrate a MongoDB database into a containerized Node.js microservice and deploy it on a Kubernetes cluster using Docker, Secrets, Persistent Volumes, and Services.

---

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Docker
* Kubernetes (kubectl, NodePort, Secrets, PVC)

---

## Prerequisites

* Docker Desktop (with Kubernetes enabled)
* Node.js & npm
* kubectl

---
##Step-by-Step Instructions

### 1. Build & Push Docker Image

```bash
docker build -t romanfern/task-9p-app:latest .
docker login
docker push romanfern/task-9p-app:latest
```

### 2. Apply Kubernetes Configurations

```bash
kubectl apply -f mongodb-secret.yaml
kubectl apply -f mongodb-storage.yaml
kubectl apply -f mongodb-deployment.yaml
kubectl apply -f mongodb-monitoring.yaml
kubectl apply -f mongodb-backup.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### 3. Check Deployment

```bash
kubectl get pods
kubectl get svc
```

> The Node.js app will be available at: `http://localhost:30036`

---

## Testing CRUD Endpoints (use CMD)

### Create

```cmd
curl -X POST "http://localhost:30036/api/items" -H "Content-Type: application/json" --data "{\"name\":\"Test Item\"}"
```

### Read All

```cmd
curl http://localhost:30036/api/items
```

### Read One

```cmd
curl http://localhost:30036/api/items/<id>
```

### Update

```cmd
curl -X PUT "http://localhost:30036/api/items/<id>" -H "Content-Type: application/json" --data "{\"name\":\"Updated Item\"}"
```

### Delete

```cmd
curl -X DELETE http://localhost:30036/api/items/<id>
```
