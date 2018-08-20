// ***********************************************
// Drive an input[type=file] element by loading a file from the fixture folder, then
// writing directly into the subject element.
// params: 
//	fileName: File to load from fixtures.
//	mimetype: defaults to image/jpeg
// ***********************************************

    Cypress.Commands.add('upload_file' ,{ prevSubject: 'element'}, (subject, fileName, mimeType) => {
        cy.fixture(fileName, 'base64').then((content) => {
            return Cypress.Blob.base64StringToBlob(content, mimeType || 'image/jpeg').then(blob => {
                const testFile = new File([blob], fileName, {type: mimeType || 'image/jpeg'});
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);
                cy.log(dataTransfer.types);
                subject[0].files = dataTransfer.files;
            });
        });
    });