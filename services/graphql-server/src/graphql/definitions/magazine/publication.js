const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  magazinePublication(input: MagazinePublicationQueryInput!): MagazinePublication @findOne(model: "platform.Product", using: { id: "_id" }, criteria: "magazinePublication")
  magazinePublications(input: MagazinePublicationsQueryInput = {}): MagazinePublicationConnection! @findMany(model: "platform.Product", criteria: "magazinePublication")
}

type MagazinePublication {
  # fields from platform.model::Product
  id: ObjectID! @value(localField: "_id")
  type: String!
  name: String
  fullName: String
  tagLine: String
  description: String
  logo: String

  # fields from platform.trait::StatusEnabled
  status: Int

  # fields directly on magazine.model::Product\Publication
  issues(input: MagazinePublicationIssuesInput = {}): MagazineIssueConnection! @refMany(model: "magazine.Issue", localField: "_id", foreignField: "publication.$id")
  sections(input: MagazinePublicationSectionsInput = {}): MagazineSectionConnection! @refMany(model: "magazine.Section", localField: "_id", foreignField: "publication.$id")
  coverImage: AssetImage @refOne(model: "platform.Asset", criteria: "assetImage")
  subscribeUrl: String
  renewalUrl: String
  reprintsUrl: String
  einquiryUrl: String
  # socialLinks: [PlatformEntityStubSocial]! @arrayValue
}

type MagazinePublicationConnection {
  totalCount: Int!
  edges: [MagazinePublicationEdge]!
  pageInfo: PageInfo!
}

type MagazinePublicationEdge {
  node: MagazinePublication!
  cursor: String!
}

enum MagazinePublicationSortField {
  id
  name
  fullName
}

input MagazinePublicationQueryInput {
  id: ObjectID!
  status: ModelStatus = active
}

input MagazinePublicationsQueryInput {
  status: ModelStatus = active
  sort: MagazinePublicationSortInput = {}
  pagination: PaginationInput = {}
}

input MagazinePublicationSectionsInput {
  status: ModelStatus = active
  sort: MagazineSectionSortInput = {}
  pagination: PaginationInput = {}
}

input MagazinePublicationIssuesInput {
  status: ModelStatus = active
  sort: MagazineIssueSortInput = {}
  pagination: PaginationInput = {}
}

input MagazinePublicationSortInput {
  field: MagazinePublicationSortField = id
  order: SortOrder = desc
}

`;