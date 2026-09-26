# ostad-prometheus


## Node EXPORTER Setup


### Download and extract Node Exporter
wget https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz
tar xvfz node_exporter-1.7.0.linux-amd64.tar.gz
sudo mv node_exporter-1.7.0.linux-amd64/node_exporter /usr/local/bin/
sudo useradd -rs /bin/false node_exporter

### Create systemd service
sudo tee /etc/systemd/system/node_exporter.service <<EOF
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

### enable system service

sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter



# Promethues install and configure

## Download and Install Prometheus
wget https://github.com/prometheus/prometheus/releases/download/v2.50.0/prometheus-2.50.0.linux-amd64.tar.gz
tar xvfz prometheus-2.50.0.linux-amd64.tar.gz
sudo mv prometheus-2.50.0.linux-amd64/prometheus /usr/local/bin/
sudo mv prometheus-2.50.0.linux-amd64/promtool /usr/local/bin/
sudo mkdir -p /etc/prometheus /var/lib/prometheus

sudo useradd -rs /bin/false prometheus
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus


## Save cofig at repo location /etc/prometheus/prometheus.yml


## Configure Systemd Service for Prometheus:
sudo tee /etc/systemd/system/prometheus.service <<EOF
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/var/lib/prometheus/

[Install]
WantedBy=multi-user.target
EOF

sudo chown -R prometheus:prometheus /etc/prometheus
sudo systemctl daemon-reload
sudo systemctl enable --now prometheus




# Grafana Setup

## Install dependencies and import GPG key
sudo apt-get install -y apt-transport-https software-properties-common wget
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list


## Enable System Service

sudo apt-get update
sudo apt-get install -y grafana
sudo systemctl daemon-reload
sudo systemctl enable --now grafana-server



## Data Sources Configuration:

Add Prometheus (http://localhost:9090) and Loki (http://localhost:3100) in Grafana > Connections > Data Sources.


## Dashboard import or create
Dashboard: Import standard Node Exporter Dashboard (Dashboard ID: 1860) or create panels using queries for:


# Grafana Loki & Promtail Setup

## Install Loki
wget https://github.com/grafana/loki/releases/download/v2.9.4/loki-linux-amd64.zip
unzip loki-linux-amd64.zip
sudo mv loki-linux-amd64 /usr/local/bin/loki

## Install Promtail (Log Collector)
wget https://github.com/grafana/loki/releases/download/v2.9.4/promtail-linux-amd64.zip
unzip promtail-linux-amd64.zip
sudo mv promtail-linux-amd64 /usr/local/bin/promtail

sudo mkdir -p /etc/loki /var/lib/loki


## Create /etc/loki/loki-local-config.yaml - uploaded on github
## Create /etc/loki/promtail-local-config.yaml - uploaded on github


# Systemd units for Loki & Promtail:
## Loki Systemd Service
sudo tee /etc/systemd/system/loki.service <<EOF
[Unit]
Description=Loki Log Aggregation System
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/loki -config.file=/etc/loki/loki-local-config.yaml

[Install]
WantedBy=multi-user.target
EOF

## Promtail Systemd Service
sudo tee /etc/systemd/system/promtail.service <<EOF
[Unit]
Description=Promtail Log Collector
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/promtail -config.file=/etc/loki/promtail-local-config.yaml

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now loki promtail




# GitHub Actions CI with Self-Hosted Runner

Go to your GitHub Repository $\rightarrow$ Settings $\rightarrow$ Actions $\rightarrow$ Runners $\rightarrow$ New self-hosted runner.
Run the provided download and configuration commands on your Ubuntu server.

Install and start the runner as a systemd service:



sudo ./svc.sh install
sudo ./svc.sh start



## create CI worlkflow - uploaded on github



---

## Service Endpoints
* **Prometheus:** `http://<SERVER_IP>:9090`
* **Node Exporter:** `http://<SERVER_IP>:9100/metrics`
* **Grafana:** `http://<SERVER_IP>:3000`
* **Loki:** `http://<SERVER_IP>:3100`

---

## Verification & Screenshots

### 1. Prometheus
* **Targets Page (Node Exporter UP):**
  ![Prometheus Targets](./screenshots/prometheus_targets.png)
* **Prometheus Expression Browser:**
  ![Prometheus Metrics](./screenshots/prometheus_query.png)

### 2. Node Exporter
* **Node Exporter /metrics Endpoint:**
  ![Node Exporter Metrics](./screenshots/node_exporter_metrics.png)

### 3. Grafana Dashboard
* **Prometheus Datasource Connected:**
  ![Grafana Prometheus DS](./screenshots/grafana_prometheus_ds.png)
* **System Metrics Dashboard (CPU, RAM, Disk, Network):**
  ![Grafana Dashboard](./screenshots/grafana_dashboard.png)

### 4. Loki Logging
* **Loki Datasource Connected:**
  ![Grafana Loki DS](./screenshots/grafana_loki_ds.png)
* **Grafana Explore Page (Log Queries via Loki):**
  ![Loki Logs](./screenshots/loki_logs.png)

### 5. GitHub Actions CI
* **Self-Hosted Runner Online:**
  ![Runner Status](./screenshots/runner_status.png)
* **Workflow Execution (Build -> Test -> Artifact):**
  ![Workflow Success](./screenshots/workflow_success.png)
* **Generated Build Artifact:**
  ![Workflow Artifact](./screenshots/github_artifact.png)

---

## Conclusion
All core requirements have been successfully implemented on Ubuntu using native systemd configurations without containerization. The pipeline successfully executes automated testing, building, and artifact uploading upon code changes.







