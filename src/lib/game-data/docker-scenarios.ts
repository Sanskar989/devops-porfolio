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

export const dockerScenarios: Scenario[] = [
    {
        title: "Dangling Images Cleanup",
        level: "Intermediate",
        description: "Task: A build server is running out of disk space. Investigate the Docker disk usage and clean it up.",
        steps: [
            {
                prompt: "First, check the Docker disk usage.",
                expectedCommands: ["docker system df"],
                hint: "Use `docker system df` to see disk usage",
                successMessage: "Disk usage summary retrieved.",
                output: `TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              42                  12                  14.2GB              10.1GB (71%)
Containers          15                  3                   1.8GB               1.5GB (83%)
Local Volumes       5                   2                   800MB               400MB (50%)
Build Cache         120                 0                   3.5GB               3.5GB

Warning: High disk usage detected across unused images and build cache.`
            },
            {
                prompt: "Clean up dangling images, unused containers, networks, and build cache.",
                expectedCommands: ["docker system prune", "docker system prune -a", "docker system prune -f", "docker system prune -af", "docker system prune --all"],
                hint: "Use the comprehensive `docker system prune` command.",
                successMessage: "✅ Scenario Complete! Reclaimed 15.5GB of disk space.",
                output: `WARNING! This will remove:
  - all stopped containers
  - all unused networks
  - all dangling images
  - all dangling build cache

Are you sure you want to continue? [y/N] y
Deleted Containers:
bf823b1c2cd1...
Deleted Images:
untagged: my-app:old-build...

Total reclaimed space: 15.5GB`
            }
        ]
    },
    {
        title: "Container Networking (DNS Resolution)",
        level: "Advanced",
        description: "Task: A custom application container 'webapp' is unable to reach the database container 'db' using its hostname. Fix the networking issue.",
        steps: [
            {
                prompt: "Inspect the 'webapp' container to check its network settings.",
                expectedCommands: ["docker inspect webapp"],
                hint: "Use `docker inspect <container_name>` to view container details.",
                successMessage: "Container details retrieved.",
                output: `[
  {
    "Id": "a1b2c3d4e5f6...",
    "Name": "/webapp",
    "NetworkSettings": {
      "Networks": {
        "bridge": {
          "IPAMConfig": null,
          "Links": null,
          "Aliases": null,
          "NetworkID": "c7d8e9f0a1b2...",
          "EndpointID": "d3e4f5a6b7c8...",
          "Gateway": "172.17.0.1",
          "IPAddress": "172.17.0.3",
          "IPPrefixLen": 16
        }
      }
    }
  }
]
Note: Container is attached to the default 'bridge' network.`
            },
            {
                prompt: "The default bridge network does not support automatic DNS resolution between containers. Connect 'webapp' to the user-defined 'app-network'.",
                expectedCommands: ["docker network connect app-network webapp"],
                hint: "Use `docker network connect <network> <container>`",
                successMessage: "✅ Scenario Complete! Container attached to custom network and can now resolve 'db' by hostname.",
                output: `webapp connected to app-network.

Testing DNS resolution...
ping db -c 1
PING db (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: icmp_seq=0 ttl=64 time=0.089 ms

--- db ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss`
            }
        ]
    },
    {
        title: "Multi-stage Build Optimization",
        level: "Advanced",
        description: "Task: Your Go application image is over 800MB. Optimize it using the provided multi-stage Dockerfile.",
        steps: [
            {
                prompt: "Check the history of 'api-service:latest' to see what's taking up space.",
                expectedCommands: ["docker history api-service:latest", "docker history api-service"],
                hint: "Use `docker history <image>` to see the layers.",
                successMessage: "Image history retrieved.",
                output: `IMAGE          CREATED       CREATED BY                                      SIZE      COMMENT
abc123def456   2 mins ago    RUN /bin/sh -c go build -o /app/api ./main.go   412MB     build output
def456ghi789   5 mins ago    COPY . /app                                     20MB      source code
ghi789jkl012   10 mins ago   RUN /bin/sh -c apk add --no-cache git build-... 250MB     dev tools
jkl012mno345   2 weeks ago   CMD ["/bin/sh"]                                 0B        
mno345pqr678   2 weeks ago   ADD file:4b5c6d7e8f9a... in /                   120MB     base os`
            },
            {
                prompt: "Build an optimized image named 'api-service:optimized' using 'Dockerfile.multistage'.",
                expectedCommands: ["docker build -t api-service:optimized -f Dockerfile.multistage .", "docker build -f Dockerfile.multistage -t api-service:optimized ."],
                hint: "Use `docker build -t <tag> -f <dockerfile> .`",
                successMessage: "✅ Scenario Complete! Image size reduced from 802MB to 18MB!",
                output: `Sending build context to Docker daemon  20.5MB
Step 1/8 : FROM golang:1.21 AS builder
 ---> 1a2b3c4d5e6f
Step 5/8 : FROM alpine:latest
 ---> alpine_base
Successfully built 9z8y7x6w5v4u
Successfully tagged api-service:optimized

New image size: 18MB`
            }
        ]
    },
    {
        title: "Live Restore Daemon Configuration",
        level: "Advanced",
        description: "Task: You need to restart the Docker daemon without stopping running containers. Configure live-restore.",
        steps: [
            {
                prompt: "First, check the current daemon configuration file.",
                expectedCommands: ["cat /etc/docker/daemon.json"],
                hint: "Use `cat` to read the Docker daemon JSON config.",
                successMessage: "Daemon config read.",
                output: `{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}`
            },
            {
                prompt: "You've added `\"live-restore\": true` to the config. Reload the Docker daemon configuration without restarting the service.",
                expectedCommands: ["kill -SIGHUP $(pidof dockerd)", "systemctl reload docker"],
                hint: "Send SIGHUP to dockerd or use systemctl reload.",
                successMessage: "✅ Scenario Complete! Live restore is now enabled without container downtime.",
                output: `Sending SIGHUP to dockerd...
Docker daemon reloaded configuration.
Live restore is now ACTIVE. Running containers will survive daemon restarts.`
            }
        ]
    },
    {
        title: "Orphaned Volumes Cleanup",
        level: "Intermediate",
        description: "Task: Local storage is depleted due to orphaned named volumes. Identify and remove them.",
        steps: [
            {
                prompt: "List only the dangling volumes (volumes not attached to any container).",
                expectedCommands: ["docker volume ls -f dangling=true", "docker volume ls --filter dangling=true"],
                hint: "Use `docker volume ls` with a filter for dangling=true.",
                successMessage: "Dangling volumes identified.",
                output: `DRIVER    VOLUME NAME
local     f3a9e01db...
local     c82b1fa49...
local     db_data_old`
            },
            {
                prompt: "Remove the orphaned volumes.",
                expectedCommands: ["docker volume prune", "docker volume prune -f"],
                hint: "Use `docker volume prune`.",
                successMessage: "✅ Scenario Complete! Storage reclaimed.",
                output: `WARNING! This will remove all local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
f3a9e01db...
c82b1fa49...
db_data_old

Total reclaimed space: 4.2GB`
            }
        ]
    },
    {
        title: "Container CPU Throttling Analysis",
        level: "Advanced",
        description: "Task: The 'worker' container is processing jobs slowly. Investigate if it's being CPU throttled by cgroups.",
        steps: [
            {
                prompt: "View the real-time resource utilization of the 'worker' container.",
                expectedCommands: ["docker stats worker", "docker stats"],
                hint: "Use `docker stats <container>`.",
                successMessage: "Stats overview retrieved.",
                output: `CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O      BLOCK I/O
9b8c7d6e5f4a   worker    99.9%     1.2GiB / 4GiB         30.0%     12MB/5MB     4MB/12MB`
            },
            {
                prompt: "The CPU is pinned. Check the container's inspect data to see its CPU limits.",
                expectedCommands: ["docker inspect worker | grep -i cpu", "docker inspect worker"],
                hint: "Inspect the config for CPU quotas.",
                successMessage: "CPU constraints identified.",
                output: `"CpuShares": 0,
"CpuPeriod": 100000,
"CpuQuota": 100000,
"CpusetCpus": "0",
// Note: Quota equals Period, meaning it is limited to exactly 1 CPU core.`
            },
            {
                prompt: "Update the running 'worker' container to grant it 2 CPU cores (Quota=200000).",
                expectedCommands: ["docker update --cpu-quota 200000 worker", "docker update --cpus 2 worker"],
                hint: "Use `docker update --cpu-quota <value>` or `--cpus <value>`.",
                successMessage: "✅ Scenario Complete! Container resources dynamically updated.",
                output: `worker updated.
New stats: CPU %: 198.5% (Utilizing 2 cores). Job processing speed increased.`
            }
        ]
    },
    {
        title: "Bypassing Entrypoint for Debugging",
        level: "Intermediate",
        description: "Task: A misconfigured image 'broken-app:latest' crashes immediately on startup. Start an interactive shell inside it to debug.",
        steps: [
            {
                prompt: "Run the image interactively, overriding its ENTRYPOINT to `/bin/sh`.",
                expectedCommands: ["docker run -it --entrypoint /bin/sh broken-app:latest", "docker run -it --entrypoint=/bin/sh broken-app:latest"],
                hint: "Use `docker run -it --entrypoint <shell> <image>`.",
                successMessage: "✅ Scenario Complete! Shell access granted.",
                output: `/ # ls -la
total 48
drwxr-xr-x    1 root     root          4096 Feb 21 00:00 .
drwxr-xr-x    1 root     root          4096 Feb 21 00:00 ..
-rwxr-xr-x    1 root     root           153 Feb 21 00:00 start.sh
/ # cat start.sh
#!/bin/sh
echo "Evaluating config..."
# Found the bug: faulty environment variable parsing!`
            }
        ]
    },
    {
        title: "Docker Buildx Cross-Compilation",
        level: "Advanced",
        description: "Task: You need to build a Docker image for both AMD64 and ARM64 architectures simultaneously.",
        steps: [
            {
                prompt: "Create and bootstrap a new buildx builder instance named 'multiarch'.",
                expectedCommands: ["docker buildx create --name multiarch --use --bootstrap", "docker buildx create --name multiarch --use", "docker buildx create --use"],
                hint: "Use `docker buildx create --name <name> --use`",
                successMessage: "Buildx context established.",
                output: `[+] Building 0.0s (0/0)
multiarch
=> [internal] booting buildkit
=> => starting container buildx_buildkit_multiarch0
=> => waiting for multiarch0 to become ready
Builder 'multiarch' is ready.`
            },
            {
                prompt: "Build the image for linux/amd64 and linux/arm64, tag it 'myapp:multi', and push it.",
                expectedCommands: ["docker buildx build --platform linux/amd64,linux/arm64 -t myapp:multi --push .", "docker buildx build --push --platform linux/amd64,linux/arm64 -t myapp:multi ."],
                hint: "Use `docker buildx build --platform <platforms> -t <tag> --push .`",
                successMessage: "✅ Scenario Complete! Multi-architecture image built and pushed.",
                output: `[+] Building 14.2s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 32B
 => [linux/amd64] resolve image config
 => [linux/arm64] resolve image config
 => exporting to image
 => => pushing layers
 => => pushing manifest for myapp:multi@sha256:abcd...`
            }
        ]
    },
    {
        title: "Recovering from Default Bridge IP Conflict",
        level: "Advanced",
        description: "Task: Your internal corporate network uses 172.17.0.0/16, causing a routing conflict with Docker's default bridge.",
        steps: [
            {
                prompt: "You need to change the default bridge subnet. What file must you edit?",
                expectedCommands: ["/etc/docker/daemon.json", "nano /etc/docker/daemon.json", "vi /etc/docker/daemon.json"],
                hint: "Modify the Docker daemon configuration file located in /etc/docker.",
                successMessage: "Config file identified.",
                output: `Opening /etc/docker/daemon.json...
Adding block:
{
  "bip": "10.200.0.1/24"
}`
            },
            {
                prompt: "Restart the Docker service for the new Bridge IP (bip) to take effect.",
                expectedCommands: ["systemctl restart docker", "service docker restart"],
                hint: "Restart the systemd docker service.",
                successMessage: "✅ Scenario Complete! IP conflict resolved.",
                output: `Restarting docker.service...
Checking ifconfig docker0:
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 10.200.0.1  netmask 255.255.255.0  broadcast 10.200.0.255
Conflict avoided. Corporate VPN routing restored.`
            }
        ]
    },
    {
        title: "Investigating Container Capabilities",
        level: "Advanced",
        description: "Task: A container needs to manipulate network rules but is failing with 'Operation not permitted'. Check its capabilities.",
        steps: [
            {
                prompt: "List the processes inside the 'router' container to get the PID.",
                expectedCommands: ["docker top router"],
                hint: "Use `docker top <container_name>`.",
                successMessage: "PID identified.",
                output: `UID                 PID                 PPID                C                   STIME               TTY
root                15432               15411               0                   10:00               ?`
            },
            {
                prompt: "Check the Linux capabilities of the container by inspecting it.",
                expectedCommands: ["docker inspect router --format='{{.HostConfig.CapAdd}}'", "docker inspect router | grep CapAdd"],
                hint: "Inspect the HostConfig.CapAdd array.",
                successMessage: "Capabilities checked.",
                output: `CapAdd: null
Note: No extra capabilities granted.`
            },
            {
                prompt: "Recreate the container, adding the NET_ADMIN capability.",
                expectedCommands: ["docker run --cap-add=NET_ADMIN -d router-image", "docker run -d --cap-add NET_ADMIN router-image"],
                hint: "Use `--cap-add=NET_ADMIN` in the run command.",
                successMessage: "✅ Scenario Complete! Container now has networking privileges.",
                output: `1a2b3c4d5e6f...
Container started with NET_ADMIN.
iptables rules successfully applied inside container.`
            }
        ]
    },
    {
        title: "Extracting Files from a Stopped Container",
        level: "Intermediate",
        description: "Task: A container crashed and was stopped. You need to extract a crash dump file from it.",
        steps: [
            {
                prompt: "List all containers, including stopped ones, to find the ID of the crashed container.",
                expectedCommands: ["docker ps -a", "docker ps --all"],
                hint: "Use `docker ps` with the all flag.",
                successMessage: "Crashed container found.",
                output: `CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS                      NAMES
78d9e01abcd2   app:v2     "node server.js"         10 minutes ago   Exited (1) 5 minutes ago    app_worker`
            },
            {
                prompt: "Copy the '/var/log/crash.dump' file from the 'app_worker' container to your current host directory.",
                expectedCommands: ["docker cp app_worker:/var/log/crash.dump .", "docker cp 78d9e01abcd2:/var/log/crash.dump ."],
                hint: "Use `docker cp <container>:<path> <host_path>`.",
                successMessage: "✅ Scenario Complete! File extracted successfully for analysis.",
                output: `Successfully copied 2.5MB to ./.
File extracted. You can now analyze the core dump locally.`
            }
        ]
    },
    {
        title: "Docker Context Switching",
        level: "Intermediate",
        description: "Task: You need to deploy a container to a remote staging server instead of your local machine.",
        steps: [
            {
                prompt: "List available Docker contexts to see your targets.",
                expectedCommands: ["docker context ls", "docker context list"],
                hint: "Use `docker context ls`.",
                successMessage: "Contexts retrieved.",
                output: `NAME        DESCRIPTION                               DOCKER ENDPOINT               ERROR
default *   Current DOCKER_HOST based configuration   unix:///var/run/docker.sock   
staging     Staging Environment                       ssh://deploy@staging-server`
            },
            {
                prompt: "Use the 'staging' context to switch your Docker CLI target.",
                expectedCommands: ["docker context use staging"],
                hint: "Use `docker context use <name>`.",
                successMessage: "✅ Scenario Complete! You are now communicating with the remote daemon.",
                output: `staging
Current context is now "staging"

Running 'docker ps' will now query the staging server.`
            }
        ]
    },
    {
        title: "Restricting Container Memory Swappiness",
        level: "Advanced",
        description: "Task: A database container is aggressively paging to disk (swapping), causing IO latency. Fix it without disabling swap entirely.",
        steps: [
            {
                prompt: "Update the 'redis-db' container to set its swappiness to 0 (only swap if absolutely necessary).",
                expectedCommands: ["docker update --memory-swappiness 0 redis-db", "docker update --memory-swappiness=0 redis-db"],
                hint: "Use `docker update` with the `--memory-swappiness` flag.",
                successMessage: "✅ Scenario Complete! Swappiness adjusted.",
                output: `redis-db updated.
kernel vm.swappiness for this cgroup set to 0.
Database IO latency dropping to normal levels.`
            }
        ]
    },
    {
        title: "Commit and Push changes to Registry",
        level: "Intermediate",
        description: "Task: You made manual hotfixes inside a running container. Save it as an image and push it to the internal registry.",
        steps: [
            {
                prompt: "Commit the running 'hotfix-container' to an image named 'registry.local:5000/app:hotfix1'.",
                expectedCommands: ["docker commit hotfix-container registry.local:5000/app:hotfix1"],
                hint: "Use `docker commit <container> <image_tag>`.",
                successMessage: "Container committed to image.",
                output: `sha256:9f8e7d6c5b4a3...`
            },
            {
                prompt: "Push the newly created image to the local registry.",
                expectedCommands: ["docker push registry.local:5000/app:hotfix1"],
                hint: "Use `docker push <image_tag>`.",
                successMessage: "✅ Scenario Complete! Image pushed.",
                output: `The push refers to repository [registry.local:5000/app]
hotfix1: digest: sha256:9f8e7... size: 1532
Push complete.`
            }
        ]
    },
    {
        title: "Debugging Docker Daemon Logs",
        level: "Advanced",
        description: "Task: A container fails to start with a vague 'endpoint error'. Check the Docker daemon logs.",
        steps: [
            {
                prompt: "Use journalctl to view the last 50 lines of the Docker daemon logs.",
                expectedCommands: ["journalctl -u docker -n 50", "journalctl -n 50 -u docker"],
                hint: "Use `journalctl -u docker`.",
                successMessage: "Daemon logs retrieved.",
                output: `Feb 21 12:00:01 host dockerd[1234]: ERRO[0054] Handler for POST /v1.41/containers/create returned error: invalid mount config for type "bind": bind source path does not exist: /data/secure_configs
Feb 21 12:00:01 host dockerd[1234]: ERRO[0054] endpoint error detail: missing host mount directory
Ah! The host directory /data/secure_configs was accidentally deleted.`
            },
            {
                prompt: "Create the missing host directory.",
                expectedCommands: ["mkdir -p /data/secure_configs", "mkdir /data/secure_configs"],
                hint: "Make the directory on the host system.",
                successMessage: "✅ Scenario Complete! Mount bind source restored.",
                output: `Directory created.
Container now starts successfully.`
            }
        ]
    },
    {
        title: "Dumping Container Root Filesystem",
        level: "Advanced",
        description: "Task: Security needs a tarball of the entire filesystem of a compromised, paused container for forensic analysis.",
        steps: [
            {
                prompt: "Export the filesystem of the 'hacked-app' container to a file named 'evidence.tar'.",
                expectedCommands: ["docker export hacked-app > evidence.tar", "docker export -o evidence.tar hacked-app", "docker export hacked-app -o evidence.tar"],
                hint: "Use `docker export`.",
                successMessage: "✅ Scenario Complete! Filesystem bundled.",
                output: `Exporting container hacked-app...
evidence.tar created (Size: 450MB)
Forensics team has been notified.`
            }
        ]
    },
    {
        title: "Docker Compose Scale Up",
        level: "Intermediate",
        description: "Task: Your website is under heavy load. You are using Docker Compose. Scale the 'web' service to 5 instances.",
        steps: [
            {
                prompt: "Scale the 'web' service using docker-compose.",
                expectedCommands: ["docker-compose up -d --scale web=5", "docker compose up -d --scale web=5"],
                hint: "Use `docker-compose up --scale <service>=<num>`.",
                successMessage: "✅ Scenario Complete! Service scaled.",
                output: `Starting project_web_1 ... done
Creating project_web_2 ... done
Creating project_web_3 ... done
Creating project_web_4 ... done
Creating project_web_5 ... done
Scaling complete. Load balancer is registering new instances.`
            }
        ]
    },
    {
        title: "Secure Docker CLI with TLS",
        level: "Advanced",
        description: "Task: You are connecting to a remote Docker daemon securely. Run a ping container using your TLS certs.",
        steps: [
            {
                prompt: "Run 'docker ps' against tcp://remote-host:2376 using TLS verify, passing your client certs.",
                expectedCommands: [
                    "docker --tlsverify --tlscacert=ca.pem --tlscert=cert.pem --tlskey=key.pem -H=tcp://remote-host:2376 ps",
                    "docker --tlsverify -H tcp://remote-host:2376 ps"
                ],
                hint: "Use `docker --tlsverify` and set the `-H` flag.",
                successMessage: "✅ Scenario Complete! Secure connection established.",
                output: `CONTAINER ID   IMAGE      COMMAND                  CREATED          STATUS          NAMES
a1b2c3d4e5f6   nginx      "/docker-entrypoint.…"   2 days ago       Up 2 days       web_proxy
Validation successful via mTLS.`
            }
        ]
    },
    {
        title: "View Docker Events Stream",
        level: "Advanced",
        description: "Task: You suspect a script is rapidly creating and destroying containers. Monitor real-time daemon events.",
        steps: [
            {
                prompt: "Watch the live stream of Docker events from the daemon.",
                expectedCommands: ["docker events"],
                hint: "Use `docker events`.",
                successMessage: "✅ Scenario Complete! Event stream captured.",
                output: `2026-02-21T12:05:01.123Z container create 9f8... (image=alpine, name=test-1)
2026-02-21T12:05:01.456Z container start 9f8... (image=alpine, name=test-1)
2026-02-21T12:05:01.890Z container die 9f8... (image=alpine, name=test-1)
2026-02-21T12:05:01.999Z container destroy 9f8... (image=alpine, name=test-1)
Rogue script identified!`
            }
        ]
    },
    {
        title: "Docker Image Vulnerability Scan",
        level: "Intermediate",
        description: "Task: Before deploying a third-party image, run a local vulnerability scan on it.",
        steps: [
            {
                prompt: "Scan the 'ubuntu:xenial' image using the native Docker scout command.",
                expectedCommands: ["docker scout cves ubuntu:xenial", "docker scan ubuntu:xenial"],
                hint: "Use `docker scout cves <image>` (or the older docker scan/trivy equivalent).",
                successMessage: "✅ Scenario Complete! Scan report generated.",
                output: `Analyzing image...

Target: ubuntu:xenial
Digest: sha256:1234567890abcdef...

Vulnerabilities found:
CRITICAL: 2
HIGH: 14
MEDIUM: 31

CVE-2019-14697 (musl libc) - CRITICAL
Fix available: Yes.
Deployment blocked pending base image update.`
            }
        ]
    }
];
