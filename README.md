# ci-ninja
CI service written in node, inspired by [node-cd](https://github.com/A21z/node-cd)

# Usage
1. `git clone https://github.com/backmeupplz/ci-ninja` on the server
2. Add scripts with the name like `{repository-name}-master.sh` to `scripts`
3. Make sure the files are executable (like `sudo chmod +x {repository-name}-master.sh`)
4. Add Webhook from your GitHub repository to `http://{server-ip}:61439/`

Aaaaand you're done.

# Samples
### `memcoin-master.sh`
My sample deploy script that I put on the server in `scripts` folder.
```bash
systemctl stop memecoin
cd /home/memcoin
rm -rf node_modules
git reset --hard
git pull
yarn install
systemctl start memecoin
curl 'https://api.telegram.org/bot1234/sendMessage?chat_id=76104711&text=%E2%9C%85%20memecoin%20has%20been%20successfully%20deployed!'
```
### `ci-ninja.service`
My sample systemd service for ubuntu to run ci-ninja
```
[Unit]
Description=Service to start ci-ninja
After=network.target

[Service]
WorkingDirectory=/home/ci-ninja
ExecStart=/usr/bin/node /home/ci-ninja/index.js

[Install]
WantedBy=multi-user.target
```
### `memecoin.service`
My sample systemd service for the Telegram bots
```
[Unit]
Description=Service to start memecoin Telegram bot
After=mongodb.service

[Service]
WorkingDirectory=/home/memcoin
ExecStart=/usr/bin/yarn distribute
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

# License
MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
