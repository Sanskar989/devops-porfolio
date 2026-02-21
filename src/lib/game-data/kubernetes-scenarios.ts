export interface ScenarioStep {
    prompt: string;
    expectedCommands: string[];
    hint: string;
    successMessage: string;
    output: string;
}

export interface Scenario {
    title: string;
    level: "Intermediate" | "Advanced";
    description: string;
    steps: ScenarioStep[];
}

export const kubernetesScenarios: Scenario[] = [
    {
        title: "CrashLoopBackOff Diagnostics",
        level: "Intermediate",
        description: "Task: The 'frontend' pod is crashing continuously. Diagnose the issue and apply the fix.",
        steps: [
            {
                prompt: "First, fetch the logs of the crashing 'frontend' pod.",
                expectedCommands: ["kubectl logs -l app=frontend", "kubectl logs deploy/frontend", "kubectl logs deployment/frontend", "kubectl logs frontend"],
                hint: "Use `kubectl logs` with a label selector or resource name.",
                successMessage: "Logs retrieved.",
                output: `[FATAL] Missing required environment variable: NGINX_CONF
[WARN] Falling back to default settings... failed.
nginx: [emerg] no configuration file found
Application exiting with code 1`
            },
            {
                prompt: "The app is missing an environment variable. Describe the deployment to see its environment configuration.",
                expectedCommands: ["kubectl describe deploy frontend", "kubectl describe deployment frontend", "kubectl describe deploy/frontend"],
                hint: "Use `kubectl describe deployment frontend`",
                successMessage: "Deployment details retrieved.",
                output: `Name:                   frontend
Namespace:              default
Containers:
   nginx:
    Environment:
      NGINX_CONF:  <set to the key 'nginx.conf' of config map 'frontend-config'>  Optional: false
Events:
  Warning  FailedSync  Error syncing pod, skipping: failed to "StartContainer" for "nginx" with CrashLoopBackOff: "CreateContainerConfigError": "configmap \\"frontend-config\\" not found"`
            },
            {
                prompt: "The ConfigMap 'frontend-config' is missing. Create it from the local 'nginx-config.yaml' file.",
                expectedCommands: ["kubectl apply -f nginx-config.yaml", "kubectl create -f nginx-config.yaml"],
                hint: "Use `kubectl apply -f <filename>`",
                successMessage: "✅ Scenario Complete! ConfigMap created, pod scaling successfully.",
                output: `configmap/frontend-config created
deployment.apps/frontend condition met

Waiting for deployment "frontend" rollout to finish: 0 of 1 updated replicas are available...
deployment "frontend" successfully rolled out!`
            }
        ]
    },
    {
        title: "NetworkPolicy Troubleshooting",
        level: "Advanced",
        description: "Task: The 'api-gateway' in the 'public' namespace cannot reach the 'payment-service' in the 'secure' namespace. Fix the isolation.",
        steps: [
            {
                prompt: "Check the NetworkPolicies in the 'secure' namespace.",
                expectedCommands: ["kubectl get networkpolicy -n secure", "kubectl get netpol -n secure"],
                hint: "List network policies using `kubectl get netpol` in the correct namespace.",
                successMessage: "Network policies listed.",
                output: `NAME           POD-SELECTOR   AGE
deny-all       <none>         45d
allow-db       app=db         45d`
            },
            {
                prompt: "The 'deny-all' policy is likely blocking traffic. Describe it to see its rules.",
                expectedCommands: ["kubectl describe netpol deny-all -n secure", "kubectl describe networkpolicy deny-all -n secure"],
                hint: "Use `kubectl describe netpol <name> -n <namespace>`",
                successMessage: "Network policy details retrieved.",
                output: `Name:         deny-all
Namespace:    secure
Created on:   2026-01-05 08:30:00 +0000
PodSelector:  <none> (Allowing the specific traffic to all pods in this namespace)
Allowing ingress traffic:
    <none> (Selected pods are isolated for ingress connectivity)
Allowing egress traffic:
    <none> (Selected pods are isolated for egress connectivity)
Policy Types: Ingress, Egress`
            },
            {
                prompt: "Apply the 'allow-gateway.yaml' file to allow ingress traffic from the 'public' namespace to the 'payment-service'.",
                expectedCommands: ["kubectl apply -f allow-gateway.yaml -n secure", "kubectl apply -n secure -f allow-gateway.yaml", "kubectl apply -f allow-gateway.yaml"],
                hint: "Apply the policy file. Standard `apply -f` is sufficient if the namespace is declared in the YAML.",
                successMessage: "✅ Scenario Complete! Ingress allowed, API Gateway can now communicate with Payment Service.",
                output: `networkpolicy.networking.k8s.io/allow-gateway created

Testing connection from api-gateway (public) to payment-service (secure)...
HTTP/1.1 200 OK
Content-Type: application/json
{"status": "healthy", "service": "payment-service"}

Connection successful!`
            }
        ]
    },
    {
        title: "RBAC Authorization Issue",
        level: "Advanced",
        description: "Task: A CI/CD service account 'deployer' in the 'prod' namespace is failing to update deployments.",
        steps: [
            {
                prompt: "Verify if the 'deployer' service account has permission to update deployments in 'prod'.",
                expectedCommands: ["kubectl auth can-i update deployments --as=system:serviceaccount:prod:deployer -n prod", "kubectl auth can-i update deployment --as=system:serviceaccount:prod:deployer -n prod"],
                hint: "Use `kubectl auth can-i <verb> <resource> --as=system:serviceaccount:<namespace>:<sa_name> -n <namespace>`",
                successMessage: "Authorization check complete.",
                output: `no
Warning: User "system:serviceaccount:prod:deployer" cannot update resource "deployments" in API group "apps" in the namespace "prod"`
            },
            {
                prompt: "List the RoleBindings in the 'prod' namespace to see what roles are assigned.",
                expectedCommands: ["kubectl get rolebinding -n prod", "kubectl get rolebindings -n prod"],
                hint: "Use `kubectl get rolebinding -n <namespace>`",
                successMessage: "RoleBindings retrieved.",
                output: `NAME               ROLE               AGE
deployer-binding   ClusterRole/view   180d
dev-team-binding   ClusterRole/edit   180d`
            },
            {
                prompt: "The 'deployer-binding' is currently using the 'view' ClusterRole. Apply 'deployer-edit.yaml' to update it to 'edit'.",
                expectedCommands: ["kubectl apply -f deployer-edit.yaml", "kubectl apply -f deployer-edit.yaml -n prod"],
                hint: "Use `kubectl apply -f deployer-edit.yaml`.",
                successMessage: "✅ Scenario Complete! Service account now has permissions to deploy.",
                output: `rolebinding.rbac.authorization.k8s.io/deployer-binding configured

Re-running authorization check:
kubectl auth can-i update deployments --as=system:serviceaccount:prod:deployer -n prod
yes

CI/CD Pipeline status: RESUMED`
            }
        ]
    },
    {
        title: "Evicted Pod Analysis",
        level: "Intermediate",
        description: "Task: A memory-intensive pod keeps getting Evicted by the physical node. Figure out why.",
        steps: [
            {
                prompt: "List pods in the default namespace, showing all namespaces so you can identify the Evicted one.",
                expectedCommands: ["kubectl get pods", "kubectl get pods -A", "kubectl get pods --all-namespaces"],
                hint: "Run `kubectl get pods`.",
                successMessage: "Pods listed.",
                output: `NAME                                READY   STATUS      RESTARTS   AGE
data-processor-59d4bc8f97-xt7z9     0/1     Evicted     0          5m
data-processor-59d4bc8f97-kj1m2     1/1     Running     0          2m`
            },
            {
                prompt: "Describe the evicted pod 'data-processor-59d4bc8f97-xt7z9' to find the eviction reason.",
                expectedCommands: ["kubectl describe pod data-processor-59d4bc8f97-xt7z9"],
                hint: "Use `kubectl describe pod <pod-name>`.",
                successMessage: "Pod description retrieved.",
                output: `Name:             data-processor-59d4bc8f97-xt7z9
Node:             ip-10-0-1-54.ec2.internal/10.0.1.54
Status:           Failed
Reason:           Evicted
Message:          The node was low on resource: memory. Container data-processor was using 4Gi, which exceeds its request of 2Gi.`
            }
        ]
    },
    {
        title: "Taint and Toleration Mismatch",
        level: "Advanced",
        description: "Task: A new GPU-accelerated pod is stuck in Pending state. The cluster has available GPU nodes.",
        steps: [
            {
                prompt: "Check the pod's events to see why it hasn't scheduled.",
                expectedCommands: ["kubectl describe pod gpu-worker", "kubectl get events | grep gpu"],
                hint: "Describe the pod 'gpu-worker' to check the scheduler events.",
                successMessage: "Events show a node selection failure.",
                output: `Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  3m    default-scheduler  0/5 nodes are available: 3 node(s) didn't match Pod's node affinity/selector, 2 node(s) had untolerated taint {hardware: gpu}. preemption: 0/5 nodes are available: 5 Preemption is not helpful for scheduling.`
            },
            {
                prompt: "The node has a taint '{hardware: gpu}'. Apply 'gpu-toleration.yaml' to add the matching toleration to the pod.",
                expectedCommands: ["kubectl apply -f gpu-toleration.yaml"],
                hint: "Use `kubectl apply -f gpu-toleration.yaml`.",
                successMessage: "✅ Scenario Complete! Pod successfully scheduled onto a GPU node.",
                output: `pod/gpu-worker configured

Checking pod status:
NAME         READY   STATUS    RESTARTS   AGE
gpu-worker   1/1     Running   0          12s`
            }
        ]
    },
    {
        title: "Decoding a Kubernetes Secret",
        level: "Intermediate",
        description: "Task: A developer lost the database password but it's stored in a Kubernetes secret named 'db-credentials'.",
        steps: [
            {
                prompt: "First, fetch the raw JSON or YAML output of the 'db-credentials' secret.",
                expectedCommands: ["kubectl get secret db-credentials -o yaml", "kubectl get secret db-credentials -o json"],
                hint: "Use `kubectl get secret <name> -o yaml`.",
                successMessage: "Secret data retrieved.",
                output: `apiVersion: v1
data:
  password: c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw==
  username: YWRtaW4=
kind: Secret
metadata:
  name: db-credentials`
            },
            {
                prompt: "The password is base64 encoded. Decode 'c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw=='.",
                expectedCommands: ["echo 'c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw==' | base64 --decode", "echo c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw== | base64 -d", "echo c3VwZXJfc2VjcmV0X3Bhc3N3b3JkXzEyMw== | base64 --decode"],
                hint: "Use `echo <string> | base64 --decode` in the shell.",
                successMessage: "✅ Scenario Complete! Password recovered.",
                output: `super_secret_password_123

Password successfully verified by the dev team.`
            }
        ]
    },
    {
        title: "Ingress Routing Debugging",
        level: "Advanced",
        description: "Task: Traffic to 'api.example.com/v2' is incorrectly routing to the V1 service.",
        steps: [
            {
                prompt: "Check the existing Ingress resource to see the routing rules.",
                expectedCommands: ["kubectl get ingress", "kubectl describe ingress"],
                hint: "Describe the ingress resource to view rules.",
                successMessage: "Ingress rules retrieved.",
                output: `Rules:
  Host              Path  Backends
  ----              ----  --------
  api.example.com
                    /v1   api-v1-service:80 (10.0.1.5:8080)
                    /     api-v1-service:80 (10.0.1.5:8080)`
            },
            {
                prompt: "The /v2 path is missing. Apply the updated ingress configuration from 'ingress-v2.yaml'.",
                expectedCommands: ["kubectl apply -f ingress-v2.yaml"],
                hint: "Apply the yaml file.",
                successMessage: "✅ Scenario Complete! Traffic successfully routing to V2.",
                output: `ingress.networking.k8s.io/api-ingress configured

Testing route:
curl -H "Host: api.example.com" http://ingress-controller/v2/health
{"version": "v2", "status": "ok"}`
            }
        ]
    },
    {
        title: "Orphaned PersistentVolume Repair",
        level: "Advanced",
        description: "Task: A StatefulSet was deleted, but its underlying PersistentVolumeClaim (PVC) 'data-db-0' is stuck in 'Terminating' state.",
        steps: [
            {
                prompt: "View the PVC to confirm its status.",
                expectedCommands: ["kubectl get pvc data-db-0", "kubectl get pvc"],
                hint: "Use `kubectl get pvc`.",
                successMessage: "PVC Status confirmed.",
                output: `NAME        STATUS        VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
data-db-0   Terminating   pvc-a1b2c3d4-e5f6-7890-abcd-ef1234567890   50Gi       RWO            gp2            100d`
            },
            {
                prompt: "A finalizer is blocking deletion. Patch the PVC to remove the 'kubernetes.io/pvc-protection' finalizer.",
                expectedCommands: ["kubectl patch pvc data-db-0 -p '{\"metadata\":{\"finalizers\":null}}'", "kubectl patch pvc data-db-0 --type=json -p='[{\"op\": \"remove\", \"path\": \"/metadata/finalizers\"}]'"],
                hint: "Use `kubectl patch pvc <name> -p '{\"metadata\":{\"finalizers\":null}}'`.",
                successMessage: "✅ Scenario Complete! Finalizer removed, volume successfully purged.",
                output: `persistentvolumeclaim/data-db-0 patched

Checking PVCs...
No resources found in default namespace.`
            }
        ]
    },
    {
        title: "Node Readiness Diagnostics",
        level: "Advanced",
        description: "Task: One of your worker nodes 'ip-10-0-1-100' transitioned to NotReady. Diagnose the node.",
        steps: [
            {
                prompt: "Describe the node to check its status conditions.",
                expectedCommands: ["kubectl describe node ip-10-0-1-100"],
                hint: "Use `kubectl describe node <node-name>`.",
                successMessage: "Node description retrieved.",
                output: `Conditions:
  Type                 Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
  ----                 ------  -----------------                 ------------------                ------                       -------
  NetworkUnavailable   False   Sat, 21 Feb 2026 10:14:12 -0000   Sat, 21 Feb 2026 10:14:12 -0000   RouteCreated                 RouteController created a route
  MemoryPressure       False   Sat, 21 Feb 2026 10:48:33 -0000   Sat, 21 Feb 2026 10:48:33 -0000   KubeletHasSufficientMemory   kubelet has sufficient memory available
  DiskPressure         False   Sat, 21 Feb 2026 10:48:33 -0000   Sat, 21 Feb 2026 10:48:33 -0000   KubeletHasNoDiskPressure     kubelet has no disk pressure
  PIDPressure          False   Sat, 21 Feb 2026 10:48:33 -0000   Sat, 21 Feb 2026 10:48:33 -0000   KubeletHasSufficientPID      kubelet has sufficient PID available
  Ready                Unknown Sat, 21 Feb 2026 10:50:33 -0000   Sat, 21 Feb 2026 10:55:00 -0000   NodeStatusUnknown            Kubelet stopped posting node status.`
            },
            {
                prompt: "The kubelet crashed. Cordon the node so no new pods are scheduled to it while you reboot the host.",
                expectedCommands: ["kubectl cordon ip-10-0-1-100"],
                hint: "Use `kubectl cordon <node-name>`.",
                successMessage: "✅ Scenario Complete! Node safely cordoned.",
                output: `node/ip-10-0-1-100 cordoned

Host reboot initiated manually via cloud provider.
Cluster auto-scaler has spun up a replacement node.`
            }
        ]
    },
    {
        title: "Executing Commands in a Container",
        level: "Intermediate",
        description: "Task: A database migration requires running a specific script inside the 'postgres-0' pod.",
        steps: [
            {
                prompt: "Execute the command `psql -U admin -c '\\l'` inside the 'postgres-0' pod to list databases.",
                expectedCommands: ["kubectl exec -it postgres-0 -- psql -U admin -c '\\l'", "kubectl exec postgres-0 -- psql -U admin -c '\\l'", "kubectl exec -it postgres-0 -c postgres -- psql -U admin -c '\\l'"],
                hint: "Use `kubectl exec <pod-name> -- <command>`.",
                successMessage: "✅ Scenario Complete! Command executed successfully.",
                output: `                                  List of databases
   Name    |  Owner  | Encoding | Collate | Ctype |   Access privileges
-----------+---------+----------+---------+-------+-----------------------
 my_app_db | admin   | UTF8     | en_US   | en_US |
 postgres  | admin   | UTF8     | en_US   | en_US |
(2 rows)

Migration prerequisite check passed.`
            }
        ]
    },
    {
        title: "HPA (Horizontal Pod Autoscaler) Adjustment",
        level: "Intermediate",
        description: "Task: The 'api-server' HPA is scaling up too aggressively during minor CPU spikes.",
        steps: [
            {
                prompt: "Get the current HPA configuration for 'api-server'.",
                expectedCommands: ["kubectl get hpa api-server", "kubectl get hpa"],
                hint: "Use `kubectl get hpa <name>`.",
                successMessage: "HPA metrics retrieved.",
                output: `NAME         REFERENCE               TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
api-server   Deployment/api-server   45%/50%   2         10        8          14d`
            },
            {
                prompt: "Edit the HPA to increase the target CPU utilization from 50% to 75%.",
                expectedCommands: ["kubectl edit hpa api-server", "kubectl patch hpa api-server"],
                hint: "Use `kubectl edit hpa <name>` and simulate saving it.",
                successMessage: "✅ Scenario Complete! Autoscaling smoothed out.",
                output: `horizontalpodautoscaler.autoscaling/api-server edited

New metrics:
NAME         REFERENCE               TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
api-server   Deployment/api-server   45%/75%   2         10        6          14d

Scale down initiated by controller manager.`
            }
        ]
    },
    {
        title: "Port Forwarding to Localhost",
        level: "Intermediate",
        description: "Task: You need to access a private internal dashboard running on pod 'admin-dash-xyz' on port 8080.",
        steps: [
            {
                prompt: "Setup a port-forward from your local machine's port 9090 to the pod's port 8080.",
                expectedCommands: ["kubectl port-forward pod/admin-dash-xyz 9090:8080", "kubectl port-forward admin-dash-xyz 9090:8080"],
                hint: "Use `kubectl port-forward <pod_name> <local_port>:<container_port>`.",
                successMessage: "✅ Scenario Complete! Secure tunnel established.",
                output: `Forwarding from 127.0.0.1:9090 -> 8080
Forwarding from [::1]:9090 -> 8080

Handling connection for 9090
Dashboard accessed locally!`
            }
        ]
    },
    {
        title: "Investigating CoreDNS Failures",
        level: "Advanced",
        description: "Task: Pods are intermittently failing to resolve external domain names. You suspect CoreDNS is dropping packets.",
        steps: [
            {
                prompt: "Check the logs of the CoreDNS pods running in the 'kube-system' namespace.",
                expectedCommands: ["kubectl logs -n kube-system -l k8s-app=kube-dns", "kubectl logs -l k8s-app=kube-dns -n kube-system"],
                hint: "Use `kubectl logs -n kube-system -l k8s-app=kube-dns`.",
                successMessage: "CoreDNS logs retrieved.",
                output: `[WARNING] plugin/errors: 2 domain.com. A: read udp 10.0.1.25:53312->8.8.8.8:53: i/o timeout
[WARNING] plugin/errors: 2 domain.com. AAAA: read udp 10.0.1.25:53312->8.8.8.8:53: i/o timeout
[ERROR] plugin/health: Local health request to "http://:8080/health" failed`
            },
            {
                prompt: "CoreDNS is timing out reaching upstream 8.8.8.8. Restart the CoreDNS deployment to clear TCP congestion.",
                expectedCommands: ["kubectl rollout restart deployment coredns -n kube-system", "kubectl -n kube-system rollout restart deployment coredns"],
                hint: "Use `kubectl rollout restart deployment <name> -n kube-system`.",
                successMessage: "✅ Scenario Complete! DNS resolution stabilized.",
                output: `deployment.apps/coredns restarted

DNS checks from worker pods passing successfully.
Incident resolved, network team notified of upstream upstream drops.`
            }
        ]
    },
    {
        title: "Testing Service Endpoints",
        level: "Advanced",
        description: "Task: A Service 'auth-svc' exists, but traffic isn't reaching its pods. Verify the Endpoints object.",
        steps: [
            {
                prompt: "Get the endpoints for 'auth-svc' to see if it's successfully mapping to pod IPs.",
                expectedCommands: ["kubectl get endpoints auth-svc", "kubectl get ep auth-svc"],
                hint: "Use `kubectl get endpoints <service-name>`.",
                successMessage: "Endpoints retrieved.",
                output: `NAME       ENDPOINTS   AGE
auth-svc   <none>      2d

Note: Endpoints is <none>, meaning the Service selector matches no pods.`
            },
            {
                prompt: "Check the labels on the auth pods to see what the Service *should* be looking for.",
                expectedCommands: ["kubectl get pods --show-labels | grep auth", "kubectl get pods -l app=auth-service --show-labels"],
                hint: "Use `kubectl get pods --show-labels`.",
                successMessage: "Pod labels retrieved.",
                output: `auth-pod-1   1/1   Running   app=authentication-service,env=prod
auth-pod-2   1/1   Running   app=authentication-service,env=prod`
            },
            {
                prompt: "The service selector is looking for 'app=auth-svc' instead of 'app=authentication-service'. Apply 'svc-fix.yaml'.",
                expectedCommands: ["kubectl apply -f svc-fix.yaml"],
                hint: "Use `kubectl apply -f svc-fix.yaml`.",
                successMessage: "✅ Scenario Complete! Endpoints populated.",
                output: `service/auth-svc configured
Endpoints updated: 10.0.1.5:8080, 10.0.1.6:8080.
Traffic is now routing correctly.`
            }
        ]
    },
    {
        title: "ConfigMap Hot Reloading",
        level: "Intermediate",
        description: "Task: A game server relies on a 'game-settings' ConfigMap. You updated it, but the pods haven't picked up the change.",
        steps: [
            {
                prompt: "Force a rolling restart of the 'game-server' deployment so it mounts the new ConfigMap.",
                expectedCommands: ["kubectl rollout restart deployment game-server"],
                hint: "Use `kubectl rollout restart deployment <name>`.",
                successMessage: "✅ Scenario Complete! Pods cycled with new config.",
                output: `deployment.apps/game-server restarted

Monitoring rollout...
Pods re-created and 'game-settings' successfully mounted.`
            }
        ]
    },
    {
        title: "Diagnosing Node NotReady (CNI Failure)",
        level: "Advanced",
        description: "Task: A node joined the cluster but remains 'NotReady'. The Kubelet indicates a CNI plugin issue.",
        steps: [
            {
                prompt: "Check the pods in the 'kube-system' namespace to see if the Calico/Flannel CNI pods are running on that node.",
                expectedCommands: ["kubectl get pods -n kube-system -o wide | grep NotReady", "kubectl get pods -n kube-system -o wide"],
                hint: "List pods in kube-system with `-o wide` to see node placement.",
                successMessage: "CNI pod status retrieved.",
                output: `calico-node-z9v2f   0/1   CrashLoopBackOff   5   12m   10.0.2.55   ip-10-0-2-55`
            },
            {
                prompt: "Check the logs of the crashing 'calico-node-z9v2f' pod.",
                expectedCommands: ["kubectl logs calico-node-z9v2f -n kube-system", "kubectl logs -n kube-system calico-node-z9v2f"],
                hint: "Use `kubectl logs <pod> -n <namespace>`.",
                successMessage: "✅ Scenario Complete! Root cause found.",
                output: `[FATAL] BGP port 179 is blocked by security group rules.
Unable to establish mesh with peer nodes.

Fix: Added port 179 to AWS Security Group. Node became Ready.`
            }
        ]
    },
    {
        title: "Validating Webhook Rejections",
        level: "Advanced",
        description: "Task: You are trying to create an Ingress, but the API server rejects it with a strange error from a ValidatingWebhookConfiguration.",
        steps: [
            {
                prompt: "List the ValidatingWebhookConfigurations in the cluster to see what might be blocking the request.",
                expectedCommands: ["kubectl get validatingwebhookconfigurations", "kubectl get validatingwebhookconfiguration"],
                hint: "Use `kubectl get validatingwebhookconfigurations`.",
                successMessage: "Webhooks retrieved.",
                output: `NAME                           AGE
cert-manager-webhook           120d
ingress-nginx-admission        120d
opa-gatekeeper-webhook         45d`
            },
            {
                prompt: "Describe the 'ingress-nginx-admission' webhook to see what resources it intercepts.",
                expectedCommands: ["kubectl describe validatingwebhookconfiguration ingress-nginx-admission"],
                hint: "Use `kubectl describe validatingwebhookconfiguration <name>`.",
                successMessage: "✅ Scenario Complete! Admission controller details analyzed.",
                output: `Rules:
  Operations: CREATE, UPDATE
  Resources: ingresses
FailurePolicy: Fail

The NGINX admission controller is validating regex in your paths.
Found a syntax error in the Ingress annotations!`
            }
        ]
    },
    {
        title: "Updating Custom Resource Definitions (CRD)",
        level: "Advanced",
        description: "Task: A newly installed Helm chart failed because its Custom Resource Definition (CRD) requires an update.",
        steps: [
            {
                prompt: "List all CRDs in the cluster and grep for 'cert-manager'.",
                expectedCommands: ["kubectl get crd | grep cert-manager", "kubectl get crds | grep cert-manager"],
                hint: "Use `kubectl get crd` and pipe to `grep`.",
                successMessage: "CRDs listed.",
                output: `certificates.cert-manager.io               2025-01-01T12:00:00Z
clusterissuers.cert-manager.io             2025-01-01T12:00:00Z
issuers.cert-manager.io                    2025-01-01T12:00:00Z`
            },
            {
                prompt: "Apply the updated CRDs from the provided 'cert-manager-crds.yaml' file.",
                expectedCommands: ["kubectl apply -f cert-manager-crds.yaml", "kubectl replace -f cert-manager-crds.yaml"],
                hint: "Use `kubectl apply -f <file>`.",
                successMessage: "✅ Scenario Complete! CRDs updated successfully.",
                output: `customresourcedefinition.apiextensions.k8s.io/certificates.cert-manager.io configured
customresourcedefinition.apiextensions.k8s.io/clusterissuers.cert-manager.io configured

Helm chart installation now executing successfully.`
            }
        ]
    },
    {
        title: "Overriding Default Service Account",
        level: "Intermediate",
        description: "Task: A pod named 's3-uploader' is failing to upload files. It needs an AWS IAM Role via IRSA.",
        steps: [
            {
                prompt: "A ServiceAccount named 's3-upload-sa' has the IRSA annotations. Edit the 's3-uploader' pod (via a yaml file 'pod.yaml') to use this service account.",
                expectedCommands: ["kubectl apply -f pod.yaml", "kubectl replace --force -f pod.yaml"],
                hint: "Since you can't dynamically change a running pod's ServiceAccount, you usually edit it and replace. Run `kubectl apply -f pod.yaml`.",
                successMessage: "✅ Scenario Complete! Pod recreated with the correct ServiceAccount.",
                output: `pod/s3-uploader configured

Checking pod logs:
Upload to s3://company-backup-bucket/data.tar.gz SUCCESS [254 MB/s]
IRSA Role assumption worked correctly.`
            }
        ]
    },
    {
        title: "Tailing Multiple Pod Logs Simultaneously",
        level: "Intermediate",
        description: "Task: Your microservice scaled to 3 instances. You need to tail the logs of ALL 3 instances at once to trace a request.",
        steps: [
            {
                prompt: "Follow the logs of all pods with the label 'app=backend-api'.",
                expectedCommands: ["kubectl logs -f -l app=backend-api", "kubectl logs -l app=backend-api -f", "kubectl logs -f --selector app=backend-api"],
                hint: "Use `kubectl logs -f -l <label>`.",
                successMessage: "✅ Scenario Complete! Aggregated logs streaming.",
                output: `[backend-api-7d4f9-a1] GET /api/v1/users 200 OK
[backend-api-7d4f9-b2] POST /api/v1/login 401 Unauthorized
[backend-api-7d4f9-c3] GET /api/v1/status 200 OK
Logs aggregated successfully.`
            }
        ]
    }
];
