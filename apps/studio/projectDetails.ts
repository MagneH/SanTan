const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET!;
const apiVersion = process.env.SANITY_STUDIO_API_VERSION!;

export { apiVersion, dataset, projectId };

export const projectDetails = () => ({
  projectId,
  dataset,
  apiVersion,
});
