# Commands to Run in Your Skills Network Lab Terminal

## IMPORTANT: Run these commands in your Skills Network LAB TERMINAL (Bash/Linux)
## NOT in your Windows PowerShell!

## Step 1: Navigate to project directory
cd /home/project

## Step 2: Verify deploymongo.yml exists
ls -la deploymongo.yml

## Step 3: Deploy MongoDB to Kubernetes
kubectl apply -f deploymongo.yml

## Step 4: Check MongoDB deployment status
kubectl get deployments

## Expected output should show:
# NAME                 READY   UP-TO-DATE   AVAILABLE   AGE
# mongodb-deployment   1/1     1            1           XXs

## Step 5: Check if MongoDB pods are running
kubectl get pods

## Step 6: If you get "port already allocated" error, edit deploymongo.yml
## Change nodePort from 30007 to 30008:
nano deploymongo.yml
# OR
vi deploymongo.yml

## Then reapply:
kubectl apply -f deploymongo.yml

## Step 7: Check MongoDB service
kubectl get services

## You should see mongodb-service listed

## ===================================
## TROUBLESHOOTING COMMANDS
## ===================================

## If deployment fails, check pod details:
kubectl describe pod <pod-name>

## View MongoDB logs:
kubectl logs -f <mongodb-pod-name>

## Delete and recreate deployment:
kubectl delete deployment mongodb-deployment
kubectl apply -f deploymongo.yml

## ===================================
## NEXT: Backend Deployment
## ===================================

## After MongoDB is running (READY 1/1), proceed to backend deployment:
cd giftlink-backend

## Set your namespace:
MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
echo $MY_NAMESPACE

## Build backend image:
docker build . -t us.icr.io/$MY_NAMESPACE/giftapp

## Push to registry:
docker push us.icr.io/$MY_NAMESPACE/giftapp

## Update deployment.yml with your namespace, then:
kubectl apply -f deployment.yml

## Check backend deployment:
kubectl get deployments
kubectl get pods

## Port forward backend (in a separate terminal):
kubectl port-forward deployment.apps/giftapp 3060:3060

## Test backend:
curl http://localhost:3060/api/gifts
