import { BLOB_SASKEY, BLOB_STORAGE_URL, BLOB_PROFILE_CONTAINER_NAME, BLOB_VIDEO_CONTAINER_NAME } from '@env';

export const AzureBlobService = () => {
  const uploadMedia = async (sourceMediaUri, mediaName, isImage) => {
    const response = await fetch(sourceMediaUri);
    const blob = await response.blob();

    let container = '';
    if (isImage) container = BLOB_PROFILE_CONTAINER_NAME;
    else container = BLOB_VIDEO_CONTAINER_NAME;
    let signedUrl = `${BLOB_STORAGE_URL}${container}/${mediaName}?${BLOB_SASKEY}`;
    console.log('Blob', signedUrl);
    await fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        processData: true,
        'Content-Type': 'application/octet-stream',
        'Content-Length': blob.size,
      },
      body: blob,
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  };

  return { uploadMedia };
};
