interface NamedTagParams {
  title: string
  description?: string
  titleTags?: string[]
  descriptionTags?: string[]
}

function createMetaTags ({
                           title,
                           description,
                           titleTags = ['og:title', 'twitter:title', 'vk:title'],
                           descriptionTags = [
                             'description',
                             'og:description',
                             'twitter:description',
                             'vk:description'
                           ]
                         }: NamedTagParams) {
  const titleResult = titleTags.map((tag) => ({
    hid: tag,
    name: tag,
    property: tag,
    content: title
  }));

  if (!description) {
    return titleResult;
  }

  return [
    ...titleResult,
    ...descriptionTags.map((tag) => ({
      hid: tag,
      name: tag,
      property: tag,
      content: description
    }))
  ];
}

export default createMetaTags;
