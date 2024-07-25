# Spell Caster

Execute a [Spark spell](https://github.com/marsfoundation/spark-spells) on a forked network with a shareable links.

Spell Caster can be run as CLI (for local testing) or configured as GitHub Action.

## Running as CLI

```bash
bun install # only first time
# fill out .env based on .env.example

#bun src/index.ts --root <spark-spells-root-path> <spell-name>
bun src/index.ts --root ../spark-spell SparkEthereum_20240627
```

## Running as Github Action

Presents results as GitHub PR comment.

```yml
      - name: Spell Caster
        uses: marsfoundation/spell-caster@action
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          TENDERLY_API_KEY: ${{ secrets.TENDERLY_ACCESS_KEY }}
          TENDERLY_PROJECT: ${{ secrets.TENDERLY_PROJECT }}
          TENDERLY_ACCOUNT: ${{ secrets.TENDERLY_USER }}
```

## Developing

```sh
bun fix # to run linter, tests and typecheck
```

### Bun support

GitHub Runners don't support bun as runner environment so we use bun for testing and bundling but not as runtime dependency.

### GH Action

New release of github action (pushed to `action`) branch is done after each commit to `main` branch.