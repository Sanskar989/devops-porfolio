export interface ScenarioStep {
    prompt: string;
    expectedCommands: string[];
    hint: string;
    successMessage: string;
    output: string;
}

export interface Scenario {
    title: string;
    severity: "P1" | "P2" | "P3";
    description: string;
    steps: ScenarioStep[];
}

export const incidentScenarios: Scenario[] = [
    {
        title: "Container OOMKilled in Production",
        severity: "P1",
        description: "Alert: Pod 'api-server-7d4f9c' in namespace 'production' is in CrashLoopBackOff. Status: OOMKilled.",
        steps: [
            {
                prompt: "First, check the pod status and recent events.",
                expectedCommands: ["kubectl describe pod", "kubectl get pod", "kubectl get pods"],
                hint: "Use kubectl to describe or get pod info",
                successMessage: "Pod status retrieved.",
                output: `NAME                  READY   STATUS             RESTARTS   AGE
api-server-7d4f9c     0/1     CrashLoopBackOff   5          12m

Events:
  Warning  OOMKilled  Container exceeded memory limit (512Mi)
  Last State: Terminated - Exit Code: 137`
            },
            {
                prompt: "Check the container's memory usage history.",
                expectedCommands: ["kubectl top pod", "kubectl top pods", "kubectl top"],
                hint: "Use kubectl top to check resource metrics",
                successMessage: "Memory metrics retrieved.",
                output: `NAME                  CPU(cores)   MEMORY(bytes)
api-server-7d4f9c     250m         498Mi / 512Mi  ← 97% usage!
api-server-prev       180m         445Mi / 512Mi  ← trending up`
            },
            {
                prompt: "Check the recent logs for memory leak indicators.",
                expectedCommands: ["kubectl logs", "kubectl log"],
                hint: "Use kubectl logs to check container output",
                successMessage: "Logs retrieved — memory leak pattern identified!",
                output: `[WARN] Heap usage: 89% - GC unable to free memory
[ERROR] java.lang.OutOfMemoryError: Java heap space
[INFO] Connection pool size: 847 (max: 100) ← LEAK FOUND
[FATAL] Container killed by OOM killer (signal 9)`
            },
            {
                prompt: "Increase the memory limit and apply the fix. Edit the deployment resource limits.",
                expectedCommands: ["kubectl edit deploy", "kubectl edit deployment", "kubectl set resources", "kubectl patch"],
                hint: "Edit the deployment to increase memory limits",
                successMessage: "✅ Incident resolved! Memory limit increased. Connection pool leak flagged for dev team.",
                output: `deployment.apps/api-server patched
  resources:
    limits:
-     memory: 512Mi
+     memory: 1Gi
    requests:
      memory: 256Mi → 512Mi

Rollout status: 1/1 replicas updated
Pod api-server-8e5a2b: Running (healthy)`
            }
        ]
    },
    {
        title: "EC2 Instance Unreachable",
        severity: "P2",
        description: "Alert: Production web server (i-0a1b2c3d4e) is not responding. Health checks failing for 5 minutes.",
        steps: [
            {
                prompt: "Check the instance status from AWS CLI.",
                expectedCommands: ["aws ec2 describe-instance", "aws ec2 describe-instances"],
                hint: "Use aws ec2 describe-instance-status or describe-instances",
                successMessage: "Instance status retrieved.",
                output: `{
  "InstanceId": "i-0a1b2c3d4e",
  "InstanceState": "running",
  "SystemStatus": "impaired",
  "InstanceStatus": "ok",
  "AvailabilityZone": "us-east-1a"
}
Note: System status impaired — likely host issue`
            },
            {
                prompt: "Check the system logs for the instance.",
                expectedCommands: ["aws ec2 get-console", "aws ec2 get-console-output"],
                hint: "Use aws ec2 get-console-output to check system logs",
                successMessage: "Console output retrieved — disk full detected!",
                output: `[  12.847] EXT4-fs error: no space left on device
[  12.848] systemd: Failed to write PID file
[  12.849] nginx: emergency - could not open error log
[  12.850] Disk /dev/xvda1: 100% used (30G/30G)
Multiple services failed to start due to disk full.`
            },
            {
                prompt: "The disk is full. Stop the instance to fix it by attaching the volume to another instance.",
                expectedCommands: ["aws ec2 stop-instance", "aws ec2 stop-instances"],
                hint: "Use aws ec2 stop-instances to stop the instance",
                successMessage: "Instance stopping. You can now detach the volume and clean it up.",
                output: `{
  "StoppingInstances": [{
    "InstanceId": "i-0a1b2c3d4e",
    "CurrentState": "stopping",
    "PreviousState": "running"
  }]
}
Instance is stopping... EBS volume can be detached.`
            },
            {
                prompt: "Start the instance back up after the volume cleanup.",
                expectedCommands: ["aws ec2 start-instance", "aws ec2 start-instances"],
                hint: "Use aws ec2 start-instances to bring it back",
                successMessage: "✅ Incident resolved! Instance back online, health checks passing.",
                output: `{
  "StartingInstances": [{
    "InstanceId": "i-0a1b2c3d4e",
    "CurrentState": "running",
    "PreviousState": "stopped"
  }]
}
Health check: PASSING
Nginx: active (running)
Disk usage: 42% (13G/30G) — old logs cleaned`
            }
        ]
    },
    {
        title: "Terraform State Lock Stuck",
        severity: "P3",
        description: "Alert: Terraform apply hangs — 'Error: Error locking state: ConditionalCheckFailedException'. Pipeline blocked for 30 minutes.",
        steps: [
            {
                prompt: "Check who holds the current state lock.",
                expectedCommands: ["terraform force-unlock", "aws dynamodb get-item", "aws dynamodb scan", "terraform show"],
                hint: "Check the DynamoDB lock table or use terraform force-unlock",
                successMessage: "Lock info retrieved.",
                output: `Lock Info:
  ID:        a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Path:      s3://tf-state/prod/terraform.tfstate
  Operation: OperationTypeApply
  Who:       ci-runner@jenkins-node-3
  Created:   2025-10-15 14:32:00 UTC (38 min ago)
  Info:      Process likely crashed mid-apply`
            },
            {
                prompt: "The CI runner crashed. Force unlock the state.",
                expectedCommands: ["terraform force-unlock"],
                hint: "Use terraform force-unlock with the lock ID",
                successMessage: "State lock released!",
                output: `Terraform state has been successfully unlocked!
Lock ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
State: UNLOCKED

Warning: Ensure no other apply is running before
proceeding with your changes.`
            },
            {
                prompt: "Verify the state is consistent before re-applying.",
                expectedCommands: ["terraform plan", "terraform validate"],
                hint: "Run terraform plan to check for drift",
                successMessage: "State validated — safe to re-apply.",
                output: `Refreshing state... [10 resources]
No changes. Your infrastructure matches the config.

Plan: 0 to add, 0 to change, 0 to destroy.
State file is consistent with remote infrastructure.`
            },
            {
                prompt: "Apply the pending infrastructure changes.",
                expectedCommands: ["terraform apply"],
                hint: "Run terraform apply to push the changes",
                successMessage: "✅ Incident resolved! Terraform apply completed successfully.",
                output: `Applying changes...

aws_ecs_service.api: Modifying... [1/3]
aws_ecs_service.api: Modifications complete  ✓
aws_lb_target_group.api: Modifying... [2/3]
aws_lb_target_group.api: Modifications complete  ✓
aws_cloudwatch_alarm.api: Creating... [3/3]
aws_cloudwatch_alarm.api: Creation complete  ✓

Apply complete! Resources: 1 added, 2 changed, 0 destroyed.`
            }
        ]
    },
    {
        title: "Malicious IP Connection Spike",
        severity: "P1",
        description: "Alert: Connection threshold exceeded on ELB. Potential DDoS or scrape attack.",
        steps: [
            {
                prompt: "Use netstat on the backend server to identify the top connecting IPs.",
                expectedCommands: ["netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n", "netstat -an | grep :80"],
                hint: "Use netstat and pipe to awk and sort.",
                successMessage: "Connection counts retrieved.",
                output: `    12 10.0.1.5
    15 10.0.1.75
  4280 203.0.113.45  <-- Suspicious`
            },
            {
                prompt: "Block the malicious IP (203.0.113.45) using iptables.",
                expectedCommands: ["iptables -A INPUT -s 203.0.113.45 -j DROP", "iptables -I INPUT -s 203.0.113.45 -j DROP"],
                hint: "Use `iptables -A INPUT -s <IP> -j DROP`.",
                successMessage: "✅ Incident resolved! IP blocked at the host level.",
                output: `iptables rule applied.
Dropping all packets from 203.0.113.45.
Connection counts normalizing. Alerting WAF team to block globally.`
            }
        ]
    },
    {
        title: "Database Deadlock Surge",
        severity: "P1",
        description: "Alert: Aurora PostgreSQL CPU at 100%, query latency spiking to 30s. Suspected deadlocks.",
        steps: [
            {
                prompt: "Connect to the database and view the active locked queries.",
                expectedCommands: ["select * from pg_stat_activity where wait_event_type = 'Lock'", "select * from pg_locks"],
                hint: "Query pg_stat_activity where state is waiting on a lock.",
                successMessage: "Locked queries identified.",
                output: `pid   | usename | wait_event | query
------+---------+------------+--------------------------------------------
14522 | appuser | lock       | UPDATE accounts SET balance = balance - 10...
14523 | appuser | lock       | UPDATE accounts SET balance = balance + 10...
-> Mutual deadlock detected on table 'accounts'.`
            },
            {
                prompt: "Terminate the blocking backend process (PID 14522) to release the lock.",
                expectedCommands: ["select pg_terminate_backend(14522)"],
                hint: "Use `pg_terminate_backend(pid)`.",
                successMessage: "✅ Incident resolved! Lock cleared, database recovering.",
                output: `pg_terminate_backend
----------------------
 t
(1 row)

Deadlock broken. Latency returning to sub-millisecond levels.`
            }
        ]
    },
    {
        title: "SSL Certificate Expired",
        severity: "P1",
        description: "Alert: PagerDuty triggered: Critical API endpoints returning SEC_ERROR_EXPIRED_CERTIFICATE.",
        steps: [
            {
                prompt: "Check the exact expiration date of the cert on the live server using openssl.",
                expectedCommands: ["openssl s_client -connect api.example.com:443 2>/dev/null | openssl x509 -noout -dates"],
                hint: "Pipe `openssl s_client` into `openssl x509 -noout -dates`.",
                successMessage: "Cert dates retrieved.",
                output: `notBefore=Feb 21 00:00:00 2025 GMT
notAfter=Feb 21 00:00:00 2026 GMT
-> Certificate expired exactly 1 hour ago.`
            },
            {
                prompt: "The new cert is in AWS ACM. Update the ALB listener to use the new cert ARN.",
                expectedCommands: ["aws elbv2 modify-listener --listener-arn <arn> --certificates CertificateArn=<new_arn>"],
                hint: "Use `aws elbv2 modify-listener` with the `--certificates` flag.",
                successMessage: "✅ Incident resolved! New certificate attached.",
                output: `{
    "Listeners": [
        {
            "Protocol": "HTTPS",
            "Port": 443,
            "Certificates": [{"CertificateArn": "arn:aws:acm:...:certificate/new-cert-id"}]
        }
    ]
}
ALB provisioning complete. Traffic secured.`
            }
        ]
    },
    {
        title: "Rogue Process Consuming CPU",
        severity: "P2",
        description: "Alert: CPU credits exhausted on Bastion host. Load average is 15.0.",
        steps: [
            {
                prompt: "Check the top processes running on the system, sorting by CPU usage.",
                expectedCommands: ["top -b -n 1", "ps aux --sort=-%cpu | head -n 10"],
                hint: "Use `top` or `ps aux`.",
                successMessage: "Top processes retrieved.",
                output: `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root     28412 99.9  0.1  14236  2012 ?        R    12:00 134:20 cryptominer
ubuntu    1422  1.0  2.3  12048  9124 pts/0    Ss   09:00   0:01 bash`
            },
            {
                prompt: "A cryptominer is running! Kill the process immediately.",
                expectedCommands: ["kill -9 28412", "kill 28412"],
                hint: "Use `kill -9 <PID>`.",
                successMessage: "✅ Incident resolved! Miner terminated.",
                output: `Process 28412 killed.
CPU Load average dropping...
1.23, 5.45, 10.12
Security incident raised to investigate initial breach vector.`
            }
        ]
    },
    {
        title: "Lost SSH Key (IAM EC2 Instance Connect)",
        severity: "P2",
        description: "Task: You lost the PEM key to `i-0f9e8d7c6b5a4`, but you need immediate SSH access to fix a production bug.",
        steps: [
            {
                prompt: "Push a temporary SSH public key to the instance using AWS EC2 Instance Connect.",
                expectedCommands: ["aws ec2-instance-connect send-ssh-public-key --instance-id i-0f9e8d7c6b5a4 --instance-os-user ec2-user --ssh-public-key file://my_key.pub"],
                hint: "Use `aws ec2-instance-connect send-ssh-public-key`.",
                successMessage: "Temporary key pushed.",
                output: `{
    "RequestId": "req-12345",
    "Success": true
}
Key injected for 60 seconds.`
            },
            {
                prompt: "SSH into the instance before the 60-second window expires.",
                expectedCommands: ["ssh -i my_key ec2-user@ip-address"],
                hint: "Standard `ssh` command.",
                successMessage: "✅ Incident resolved! Emergency access achieved.",
                output: `Last login: Sat Feb 21 10:00:00 2026 from ...
[ec2-user@ip-10-0-1-50 ~]$ 
You are in.`
            }
        ]
    },
    {
        title: "DNS Zone Deleted Accidentally",
        severity: "P1",
        description: "Alert: Customer site is down. Route53 'example.com' zone was deleted by an automated script.",
        steps: [
            {
                prompt: "Create a new hosted zone for example.com to restore service.",
                expectedCommands: ["aws route53 create-hosted-zone --name example.com --caller-reference $(date +%s)"],
                hint: "Use `aws route53 create-hosted-zone`.",
                successMessage: "Zone created.",
                output: `{
    "HostedZone": {
        "Id": "/hostedzone/Z1NEW123",
        "Name": "example.com.",
        "CallerReference": "1676974000"
    },
    "DelegationSet": {
        "NameServers": ["ns-1.awsdns-1.com", "ns-2.awsdns-2.com"]
    }
}`
            },
            {
                prompt: "Update the domain registrar (simulated) with the new NameServers. Then import the zone file backup.",
                expectedCommands: ["aws route53 change-resource-record-sets --hosted-zone-id Z1NEW123 --change-batch file://backup.json"],
                hint: "Use `aws route53 change-resource-record-sets`.",
                successMessage: "✅ Incident resolved! DNS resolution restoring based on TTLs.",
                output: `{
    "ChangeInfo": {
        "Id": "/change/C1NEW456",
        "Status": "PENDING",
        "SubmittedAt": "2026-02-21T12:00:00Z"
    }
}
Records imported. Site will be back up momentarily.`
            }
        ]
    },
    {
        title: "Kubelet Client Certificate Expiration",
        severity: "P1",
        description: "Alert: EKS Node successfully registered, but metrics-server shows no data and `kubectl exec` fails with 'x509: certificate has expired'.",
        steps: [
            {
                prompt: "Check the kubelet certificate expiration on the node.",
                expectedCommands: ["openssl x509 -in /var/lib/kubelet/pki/kubelet-client-current.pem -noout -enddate"],
                hint: "Use openssl x509 on the kubelet client cert.",
                successMessage: "Cert dates retrieved.",
                output: `notAfter=Feb 20 23:59:59 2026 GMT
-> The node's client cert to talk to the API server expired yesterday!`
            },
            {
                prompt: "Check the CSRs (Certificate Signing Requests) on the cluster to see if the kubelet tried to renew.",
                expectedCommands: ["kubectl get csr"],
                hint: "Use `kubectl get csr`.",
                successMessage: "CSRs listed.",
                output: `NAME        AGE    SIGNERNAME                                    REQUESTOR                 CONDITION
csr-8b9c0   10h    kubernetes.io/kubelet-serving                 system:node:ip-10-0-1-5   Pending`
            },
            {
                prompt: "The auto-approver failed. Manually approve the CSR to issue the new certificate.",
                expectedCommands: ["kubectl certificate approve csr-8b9c0"],
                hint: "Use `kubectl certificate approve <name>`.",
                successMessage: "✅ Incident resolved! Certificate issued.",
                output: `certificatesigningrequest.certificates.k8s.io/csr-8b9c0 approved
Node metrics flowing again. Exec and Logs working.`
            }
        ]
    },
    {
        title: "Redis Connection Refused",
        severity: "P2",
        description: "Alert: Application failing to cache. Error: `Connection refused` on Redis port 6379.",
        steps: [
            {
                prompt: "Check if the Redis service is running on the cache server.",
                expectedCommands: ["systemctl status redis", "systemctl status redis-server"],
                hint: "Use `systemctl status redis`.",
                successMessage: "Service status retrieved.",
                output: `● redis-server.service - Advanced key-value store
     Loaded: loaded (/lib/systemd/system/redis-server.service; enabled; vendor preset: enabled)
     Active: active (running) since Sat 2026-02-21 00:00:00 UTC; 12h ago
   Main PID: 1234 (redis-server)`
            },
            {
                prompt: "It's running. Check what interfaces Redis is bound to.",
                expectedCommands: ["netstat -tlnp | grep 6379", "ss -tlnp | grep 6379"],
                hint: "Use `netstat` or `ss` and grep for the port.",
                successMessage: "Bindings retrieved.",
                output: `tcp     0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      1234/redis-server`
            },
            {
                prompt: "Redis is bound to localhost only! Edit redis.conf to bind to 0.0.0.0, then restart it.",
                expectedCommands: ["systemctl restart redis", "systemctl restart redis-server"],
                hint: "Assume the config is edited. Just restart the service.",
                successMessage: "✅ Incident resolved! Cache server is now accepting external connections.",
                output: `Restarting redis-server.service...
tcp     0      0 0.0.0.0:6379          0.0.0.0:*               LISTEN      1456/redis-server
Application cache restored.`
            }
        ]
    },
    {
        title: "CloudFront Cache Invalidations Failing",
        severity: "P3",
        description: "Task: A bad deployment was pushed. You rolled back the code, but users still see the broken site. CloudFront caching.",
        steps: [
            {
                prompt: "Create an invalidation request for all files on the CloudFront distribution 'E1A2B3C4D5E6F7'.",
                expectedCommands: ["aws cloudfront create-invalidation --distribution-id E1A2B3C4D5E6F7 --paths '/*'"],
                hint: "Use `aws cloudfront create-invalidation` with the `--paths` flag.",
                successMessage: "✅ Incident resolved! Cache purged.",
                output: `{
    "Invalidation": {
        "Id": "I2J3K4L5M6N7O8",
        "Status": "InProgress",
        "CreateTime": "2026-02-21T12:00:00.000Z",
        "InvalidationBatch": {
            "Paths": {
                "Quantity": 1,
                "Items": ["/*"]
            }
        }
    }
}
Users receiving the rolled-back version.`
            }
        ]
    },
    {
        title: "IAM Role Trust Policy Error",
        severity: "P2",
        description: "Alert: A Lambda function is failing to assume a cross-account role: 'User is not authorized to perform: sts:AssumeRole'.",
        steps: [
            {
                prompt: "Check the Trust Policy of the target IAM Role 'cross-account-db-access'.",
                expectedCommands: ["aws iam get-role --role-name cross-account-db-access"],
                hint: "Use `aws iam get-role`.",
                successMessage: "Role policy retrieved.",
                output: `{
    "Role": {
        "AssumeRolePolicyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": { "AWS": "arn:aws:iam::111111111111:root" },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
    }
}
Notice: The principal is account 111111111111.`
            },
            {
                prompt: "The Lambda is in account 222222222222. Update the trust policy (using local file 'trust.json') to allow the correct account.",
                expectedCommands: ["aws iam update-assume-role-policy --role-name cross-account-db-access --policy-document file://trust.json"],
                hint: "Use `aws iam update-assume-role-policy`.",
                successMessage: "✅ Incident resolved! Lambda successfully assuming the role.",
                output: `Policy updated successfully.
AssumeRole test from Account 222222222222: SUCCESS.
Data pipeline resumed.`
            }
        ]
    },
    {
        title: "S3 Bucket Public Access Blocked",
        severity: "P2",
        description: "Task: A public assets bucket is returning 403 Forbidden. The bucket policy is correct.",
        steps: [
            {
                prompt: "Check the Public Access Block configuration on the bucket 'company-assets'.",
                expectedCommands: ["aws s3api get-public-access-block --bucket company-assets"],
                hint: "Use `aws s3api get-public-access-block`.",
                successMessage: "Configuration retrieved.",
                output: `{
    "PublicAccessBlockConfiguration": {
        "BlockPublicAcls": true,
        "IgnorePublicAcls": true,
        "BlockPublicPolicy": true,  <-- HERE IS THE CULPRIT
        "RestrictPublicBuckets": true
    }
}`
            },
            {
                prompt: "Remove the public access block configuration entirely to allow the bucket policy to function.",
                expectedCommands: ["aws s3api delete-public-access-block --bucket company-assets"],
                hint: "Use `aws s3api delete-public-access-block`.",
                successMessage: "✅ Incident resolved! Assets are loading.",
                output: `Public access block deleted.
HTTP 200 OK on https://company-assets.../logo.png
Website styling restored.`
            }
        ]
    },
    {
        title: "Docker Registry Authentication Failure",
        severity: "P2",
        description: "Alert: CI/CD Pipeline failing to pull images from ECR. Error: 'no basic auth credentials'.",
        steps: [
            {
                prompt: "Authenticate your local Docker client to the ECR registry at '123456789012.dkr.ecr.eu-west-1.amazonaws.com'.",
                expectedCommands: ["aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.eu-west-1.amazonaws.com", "aws ecr get-login-password | docker login"],
                hint: "Pipe `aws ecr get-login-password` to `docker login`.",
                successMessage: "✅ Incident resolved! Authentication established.",
                output: `Login Succeeded
CI/CD Pipeline re-triggered: IMAGE PULL SUCCESSFUL.`
            }
        ]
    },
    {
        title: "Elasticsearch Unassigned Shards",
        severity: "P2",
        description: "Alert: Cluster health is YELLOW. Some shards are unassigned.",
        steps: [
            {
                prompt: "Use the cat allocation API to see which nodes have unassigned shards.",
                expectedCommands: ["curl -X GET 'localhost:9200/_cat/allocation?v'", "curl localhost:9200/_cat/allocation?v"],
                hint: "Use `curl -X GET 'localhost:9200/_cat/allocation?v'`.",
                successMessage: "Allocation retrieved.",
                output: `shards disk.indices disk.used disk.avail disk.total disk.percent host      ip        node
  1200       98.5gb   100.0gb        0gb    100.0gb          100 10.0.1.5  10.0.1.5  node-1
   800       40.0gb    45.0gb     55.0gb    100.0gb           45 10.0.1.6  10.0.1.6  node-2
    50   UNASSIGNED`
            },
            {
                prompt: "Node-1 is at 100% disk capacity, hitting the watermark limit so shards won't allocate. Increase Node-1 volume size via AWS CLI.",
                expectedCommands: ["aws ec2 modify-volume --volume-id vol-0a1b2c --size 200"],
                hint: "Use `aws ec2 modify-volume`.",
                successMessage: "✅ Incident resolved! Disk resized, shards allocating.",
                output: `{
    "VolumeModification": {
        "VolumeId": "vol-0a1b2c",
        "ModificationState": "modifying",
        "TargetSize": 200
    }
}
Elasticsearch cluster health: GREEN.`
            }
        ]
    },
    {
        title: "Tracking a Deleted File",
        severity: "P2",
        description: "Task: A critical config file was deleted from a running container. You know the file path but not which process deleted it.",
        steps: [
            {
                prompt: "Use `auditd` logs to search for delete (unlink) actions on `/etc/app/config.yaml`.",
                expectedCommands: ["ausearch -f /etc/app/config.yaml", "grep /etc/app/config.yaml /var/log/audit/audit.log"],
                hint: "Use `ausearch -f <file>`.",
                successMessage: "✅ Incident resolved! Culprit identified.",
                output: `time->Sat Feb 21 12:05:00 2026
type=PATH msg=audit(1676981100:123): item=0 name="/etc/app/config.yaml" inode=12345 dev=08:01 mode=0100644 ouid=0 ogid=0 rdev=00:00
type=SYSCALL msg=audit(1676981100:123): arch=c000003e syscall=87 success=yes exit=0 a0=7ffcd... exe="/usr/local/bin/cleanup_script.sh" uid=0
-> The file was deleted by a rogue cleanup_script.sh!`
            }
        ]
    },
    {
        title: "Linux Out of Inodes",
        severity: "P2",
        description: "Alert: 'No space left on device' when trying to touch a file, but `df -h` shows 50% storage available.",
        steps: [
            {
                prompt: "Check the filesystem *inode* usage.",
                expectedCommands: ["df -i"],
                hint: "Use `df -i`.",
                successMessage: "Inode usage retrieved.",
                output: `Filesystem      Inodes   IUsed   IFree IUse% Mounted on
/dev/nvme0n1p1   6.5M    6.5M       0  100% /
udev             1.0M     412    1.0M    1% /dev`
            },
            {
                prompt: "Find the directory containing millions of small files. E.g., check /var/spool.",
                expectedCommands: ["find /var/spool/postfix/maildrop -type f | wc -l", "ls -f /var/spool/postfix/maildrop | wc -l"],
                hint: "Count files in a directory using find or ls -f.",
                successMessage: "✅ Incident resolved! Millions of stuck emails identified and purged.",
                output: `6498211
Deleting maildrop queue...
Filesystem inodes back to 15%. 'No space left on device' resolved.`
            }
        ]
    },
    {
        title: "Slow Network Bottleneck Identification",
        severity: "P2",
        description: "Task: Latency between two internal EC2 instances is extremely high. Debug the connection.",
        steps: [
            {
                prompt: "Run a trace route using TCP on port 443 to the target IP 10.0.5.50 to find the bottleneck hop.",
                expectedCommands: ["tcptraceroute 10.0.5.50 443", "traceroute -T -p 443 10.0.5.50"],
                hint: "Use `tcptraceroute` or `traceroute -T`.",
                successMessage: "✅ Incident resolved! Asymmetric routing issue identified at a VPC Transit Gateway attachment.",
                output: `Selected device eth0, address 10.0.1.15, port 58241 for outgoing packets
Tracing the path to 10.0.5.50 on TCP port 443 (https), 30 hops max
 1  10.0.1.1  0.512 ms  0.428 ms  0.401 ms
 2  10.0.0.254 (VPC Peering)  120.5 ms  121.2 ms  120.8 ms <-- BOTTLENECK
 3  10.0.5.50 [open]  121.4 ms  120.9 ms  121.1 ms
Network team notified of Peering connection saturation.`
            }
        ]
    },
    {
        title: "Recovering a Deleted File via Open File Descriptor",
        severity: "P2",
        description: "Task: A developer accidentally deleted a massive log file `app.log` currently being written to by an active process.",
        steps: [
            {
                prompt: "Find the process ID of the application that still holds the file descriptor open.",
                expectedCommands: ["lsof | grep app.log", "lsof +L1"],
                hint: "Use `lsof | grep <filename>`.",
                successMessage: "Process and FD identified.",
                output: `COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF   NODE NAME
java     4512  app    15w   REG   8,1      1M 124312 /var/log/app.log (deleted)`
            },
            {
                prompt: "Copy the file directly from the `/proc/` filesystem using the PID (4512) and File Descriptor (15).",
                expectedCommands: ["cat /proc/4512/fd/15 > /var/log/app.log_recovered", "cp /proc/4512/fd/15 /var/log/app.log_recovered"],
                hint: "Use `cp /proc/<pid>/fd/<fd> <new_path>`.",
                successMessage: "✅ Incident resolved! Log file extracted from memory.",
                output: `File successfully copied.
tail -n 2 /var/log/app.log_recovered
[INFO] Transaction 9912 complete.
[ERROR] Database timeout on query 4.`
            }
        ]
    }
];
