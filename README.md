# SIT323 Task 6.1P – Kubernetes Deployment of Node.js App

This repository contains the configuration files and instructions for deploying a containerized Node.js application to a Kubernetes cluster using Docker Desktop and Helm.

## Prerequisites

- Docker Desktop with Kubernetes enabled
- Helm installed (`winget install Helm.Helm` or `brew install helm`)
- `kubectl` CLI
- Docker image: `romanfern/node-web-app`

## Setup Instructions

### 1. Enable Kubernetes in Docker Desktop

1. Open Docker Desktop
2. Go to **Settings > Kubernetes**
3. Enable Kubernetes and click **Apply & Restart**
4. Wait until "Kubernetes is running"

### 2. Install Helm and Deploy Kubernetes Dashboard

```bash
helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
helm repo update
helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard \
  --create-namespace --namespace kubernetes-dashboard
```

### 3. Create Admin User for Dashboard

Create `dashboard-adminuser.yaml`:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

Apply it:
```bash
kubectl apply -f dashboard-adminuser.yaml
```

Create `cluster-role-binding.yaml`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

Apply it:
```bash
kubectl apply -f cluster-role-binding.yaml
```

Get token for login:
```bash
kubectl -n kubernetes-dashboard create token admin-user
```

Port-forward the dashboard:
```bash
kubectl port-forward -n kubernetes-dashboard service/kubernetes-dashboard-kong-proxy 8443:443
```

Access the dashboard:
```
https://localhost:8443
```

Login using the token.

## Application Deployment

### 4. Create Kubernetes Deployment

`deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-web-app-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: node-web-app
  template:
    metadata:
      labels:
        app: node-web-app
    spec:
      containers:
        - name: node-web-app
          image: romanfern/node-web-app
          ports:
            - containerPort: 8080
```

### 5. Create Kubernetes Service

`service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-web-app-service
spec:
  type: NodePort
  selector:
    app: node-web-app
  ports:
    - port: 80
      targetPort: 8080
      nodePort: 30036
```

### 6. Deploy the App

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### 7. Access the App

Visit:
```
http://localhost:30036
```

The app should now be accessible via browser.
