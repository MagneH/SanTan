import { Home, Tags, Users } from 'lucide-react';
import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure';
import DocumentsPane from 'sanity-plugin-documents-pane';

import { sanityTypeLiterals } from '@santan/shared/types';
import { JSONPreview } from './components/JSONPreview';

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // Singleton, home page curation
      S.listItem().icon(Home).id('home').title('Home').child(defaultDocumentViews(S, sanityTypeLiterals.home)),
      S.divider(),
      // Document lists
      S.documentTypeListItem('post').title('Artikler'),
      S.documentTypeListItem('category').title('Kategorier').icon(Tags), //Plural
      S.divider(),
      S.documentTypeListItem('author').title('Skribenter').icon(Users), //Plural
    ]);

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType, documentId }) => {
  switch (schemaType) {
    default:
      return defaultDocumentViews(S, schemaType as sanityTypeLiterals);
  }
};

const defaultDocumentViews = (S: StructureBuilder, documentType: sanityTypeLiterals) =>
  S.document()
    .schemaType(documentType)
    .views([
      S.view.form(),
      S.view.component(JSONPreview).title('JSON'),
      S.view
        .component(DocumentsPane)
        .options({
          query: `*[references($id)]`,
          params: { id: `_id` },
          options: { perspective: 'previewDrafts' },
        })
        .title('Dokumenter som refererer til dette'),
    ]);
