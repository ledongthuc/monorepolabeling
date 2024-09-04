# Monorepo labelling

Detects pull requests files changes and add labels to the pull request. User can define file change patterns and map it to labels we want to add to.

## Inputs

### `matching-patterns`

Mapping between file changes pattern and label we want to add to github pull request. Examples:

      /file/a/*:serviceA
      /file/b/*:serviceB

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `labels`

List of labels match with files changes

## Example usage

```yaml
```
