# 📐 Guideline

To make contribution, please follow the guideline below.

## Code Style

We use a modified version of Vue code style.

**Please do use [VSCode] and have [ESLint plugin] install**.
It will check and fix code style mismatch automatically.

*This rule configs can be found in [.eslintrc.js][eslintrc] file.*

## Commit Message Format

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

### Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

Reference(s):

- [https://seesparkbox.com/foundry/semantic_commit_messages]
- [http://karma-runner.github.io/1.0/dev/git-commit-msg.html]

[VSCode]: https://code.visualstudio.com/
[ESLint plugin]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[eslintrc]: https://github.com/antfu/splitoast/blob/master/.eslintrc.js