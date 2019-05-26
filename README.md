# zeit-github-discord-webhook

A [Zeit Now](https://zeit.co/now) lambda that filters pull requests from GitHub webhooks and relays them to Discord.

## Usage

1. Configure to your liking by editing the "env" section in the `now.json` file.
    - `USE_ENTIRE_BODY`: If set to "true", the entire pull request body is used as the description.
        Otherwise, uses the first paragraph.
2. Deploy to Zeit Now:
    - `npm install -g now`
    - `git clone https://github.com/brianpeiris/zeit-github-discord-webhook`
    - `cd zeit-github-discord-webhook`
    - `now`
3. Add a Discord webhook to your github repo like:  
    `https://zeit-github-discord-webhook-abcde1234.now.sh/?h=<discord-webhook-id>/<discord-webhook-key>`
