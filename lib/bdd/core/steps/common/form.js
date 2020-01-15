const { Then } = require('cucumber');
const { form } = require('../../actions');

Then('I clear field {string}', form.emptyFormField);

Then('I fill field {string} with {string}', form.fillInFormField);

Then('I select {string} from {string}', form.selectValueFromField);

Then('I should see {string} have value {string}', form.hasValue);
