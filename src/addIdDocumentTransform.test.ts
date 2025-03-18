import { parse, print } from 'graphql';

import { addIdDocumentTransform } from './addIdDocumentTransform';

const schemaSDL = /* GraphQL */ `
  type Query {
    user: User
  }

  type User {
    id: ID
    name: String
  }
`;

const schema = parse(schemaSDL);

describe('addIdDocumentTransform', () => {
  it('adds id field if it exists in the type', async () => {
    const documents = [
      {
        document: parse(/* GraphQL */ `
          query getUser {
            user {
              name
            }
          }
        `),
      },
    ];

    const transformedDocuments = addIdDocumentTransform.transform({
      schema,
      documents,
    });
    const [transformedDocument] = await transformedDocuments;

    expect(print(transformedDocument!.document!)).toMatchInlineSnapshot(`
      "query getUser {
        user {
          name
          id
        }
      }"
    `);
  });

  it('does not add id field if it already exists in the selection set', async () => {
    const documents = [
      {
        document: parse(/* GraphQL */ `
          query getUser {
            user {
              name
              id
            }
          }
        `),
      },
    ];

    const transformedDocuments = addIdDocumentTransform.transform({
      schema,
      documents,
    });
    const [transformedDocument] = await transformedDocuments;

    expect(print(transformedDocument!.document!)).toMatchInlineSnapshot(`
      "query getUser {
        user {
          name
          id
        }
      }"
    `);
  });

  it('does not add id field if it does not exist in the type', async () => {
    const schemaWithoutId = parse(/* GraphQL */ `
      type Query {
        product: Product
      }

      type Product {
        name: String
      }
    `);

    const documents = [
      {
        document: parse(/* GraphQL */ `
          query getProduct {
            product {
              name
            }
          }
        `),
      },
    ];

    const transformedDocuments = addIdDocumentTransform.transform({
      schema: schemaWithoutId,
      documents,
    });
    const [transformedDocument] = await transformedDocuments;

    expect(print(transformedDocument!.document!)).toMatchInlineSnapshot(`
      "query getProduct {
        product {
          name
        }
      }"
    `);
  });
});
