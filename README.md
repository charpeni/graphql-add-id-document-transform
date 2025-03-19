# graphql-add-id-document-transform

<img height="100" src="https://github.com/user-attachments/assets/752feb96-c8d3-496b-b861-b36db1f9b3d4" align="right" />

[![Version](https://badge.fury.io/js/graphql-add-id-document-transform.svg)](https://www.npmjs.org/package/graphql-add-id-document-transform)
[![Monthly Downloads](https://img.shields.io/npm/dm/graphql-add-id-document-transform)](https://www.npmjs.org/package/graphql-add-id-document-transform)
[![Codecov](https://codecov.io/gh/charpeni/graphql-add-id-document-transform/graph/badge.svg?token=KXQCYOMPYH)](https://codecov.io/gh/charpeni/graphql-add-id-document-transform)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/charpeni/graphql-add-id-document-transform/blob/main/LICENSE)

GraphQL document transform that ensures cache normalization by automatically querying for `id` fields when available.

## Why

[Apollo Client](https://github.com/apollographql/apollo-client) doesn't have intrinsic knowledge of your schema, so it can't automatically determine if an `id` field should be queried for proper cache normalization. Fortunately, [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) is aware of your schema and knows whether there are necessary `id` fields to add to your queries, ensuring optimal cache normalization.

> [!NOTE]
> This is not a silver bullet for cache normalization issues, but rather a safety net when other approaches have failed.
>
> It's still valuable to understand cache normalization concepts thoroughly. Consider using type-aware linters like the [`require-selections`](https://the-guild.dev/graphql/eslint/rules/require-selections) rule from [`@graphql-eslint/eslint-plugin`](https://the-guild.dev/graphql/eslint/docs) (previously known as `require-id-when-available`).
>
> If you're experiencing normalization issues that prevent you from fully utilizing your GraphQL cache, this document transform provides a practical solution.

## Installation

```sh
npm install --dev graphql-add-id-document-transform
```

## Usage

> [!IMPORTANT]
> This is meant to be used with [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator), but could probably be reused in others as well.

Simply pass the `addIdDocumentTransform` function to the `documentTransforms` field of your GraphQL Code Generator configuration (`codegen.ts`).

```diff
import type { CodegenConfig } from '@graphql-codegen/cli';
+import { addIdDocumentTransform } from 'graphql-add-id-document-transform';

const config: CodegenConfig = {
  schema: 'https://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/gql/': {
      preset: 'client',
+     documentTransforms: [addIdDocumentTransform],
    },
  },
};

export default config;
```

[📚 Documentation > Advanced Usage > Document Transform](https://the-guild.dev/graphql/codegen/docs/advanced/document-transform)

## License

graphql-add-id-document-transform is [MIT licensed](LICENSE).
