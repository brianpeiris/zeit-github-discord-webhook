# zeit-github-discord-webhook

A [Zeit Now](https://zeit.co/now) lambda that filters GitHub webhooks for Discord.

## Usage

1. Deploy to Zeit Now:
    - `npm install -g now`
    - `git clone https://github.com/brianpeiris/zeit-github-discord-webhook`
    - `cd zeit-github-discord-webhook`
    - `now`
2. Add a Discord webhook to your github repo like:  
    `https://zeit-github-discord-webhook-abcde1234.now.sh/?h=<discord-webhook-id>/<discord-webhook-key>`
