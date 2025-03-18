import type { Types } from '@graphql-codegen/plugin-helpers';
import {
  Kind,
  TypeInfo,
  buildASTSchema,
  isObjectType,
  visit,
  visitWithTypeInfo,
} from 'graphql';

export const addIdDocumentTransform = {
  transform: ({
    schema: astSchema,
    documents,
  }: Pick<
    Parameters<Types.DocumentTransformFunction>[0],
    'schema' | 'documents'
  >): ReturnType<Types.DocumentTransformFunction> => {
    const schema = buildASTSchema(astSchema);
    const typeInfo = new TypeInfo(schema);

    return documents.map((documentFile) => {
      if (!documentFile.document) {
        return documentFile;
      }

      documentFile.document = visit(
        documentFile.document,
        visitWithTypeInfo(typeInfo, {
          SelectionSet(node) {
            const parentType = typeInfo.getParentType();

            if (isObjectType(parentType)) {
              const fields = parentType.getFields();

              const selectionHasIdField = node.selections.some(
                (selection) =>
                  selection.kind === Kind.FIELD &&
                  selection.name.value === 'id',
              );

              if ('id' in fields && !selectionHasIdField) {
                node.selections = [
                  ...node.selections,
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: 'id' },
                  },
                ];
              }
            }

            return node;
          },
        }),
      );

      return documentFile;
    });
  },
};
