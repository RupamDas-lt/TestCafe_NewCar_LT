import { Selector, ClientFunction, RequestMock } from "testcafe";
import { test_data } from '../../tests/testData';
const axios = require('axios');

import { config } from "../../config";

let second_file_execution_start = 0;
const setSessionStorageItem = ClientFunction((key: string, value: string) =>
  window.sessionStorage.setItem(key, value),
);
const mockTealiumTracking = RequestMock()
  .onRequestTo(request => {
    return request.url.indexOf("https://tags.tiqcdn.com/utag/truecar/") > -1;
  })
  .respond((req, res) => {
    res.setBody("<html><body><h1>OK</h1></body></html>");
  });

fixture("Used Car Lead Submission")
  .page("https://www.qa.truecardev.com/")
  .requestHooks(mockTealiumTracking);

test("can submit used car lead", async t => {
  second_file_execution_start = new Date().getTime();
  await setSessionStorageItem("regPromptShown", "true");
  const Faker = require("faker");
  // Using Alaska to avoid TC+ listing
  const zip = "99540";
  const phone = `323343${Faker.phone.phoneNumber("####")}`;
  const usedShopBtn = await Selector(
    '[data-test="homepageHeroPanelShopUsedButton"]',
  ).with({ visibilityCheck: true });

  const zipcodeBtn = await Selector(
    '[data-test="searchFiltersLocationButton"]',
  ).with({ visibilityCheck: true });
  const zipcodeTextField = await Selector(
    '[data-test="zipcodeModalTextfield"]',
  ).with({ visibilityCheck: true });
  const saveZipBtn = await Selector('[data-test="saveZipButton"]');

  const mobileFilterMenuBtn = await Selector(
    '[data-test="searchFiltersToggle"]',
  ).with({ visibilityCheck: true });
  const mobileFooter = await Selector('[data-test="modalFooter"]');

  const usedHeading = Selector('[data-test="searchHeadingMarketplace"]');
  const firstVehicleListingCard = Selector(
    '[data-test="allVehicleListings"] [data-test="usedListing"]',
  ).nth(0);
  const mobileUnlockDealerBtn = Selector(
    '[data-test="mobileFooter"] [data-test="unlockVdpDeal"]',
  ).with({
    visibilityCheck: true,
  });

  const unlockDealerBtn = Selector(
    '[data-test="stickyRightRail"] [data-test="unlockVdpDeal"]',
  )
    .with({
      visibilityCheck: true,
    })
    .with({ timeout: 20000 });
  const continueAsGuest = Selector('[data-test="continueAsGuestCta"]').with({
    visibilityCheck: true,
  });
  const email = Selector('[data-test="enterProfileEmail"]');
  const firstName = Selector('[data-test="firstNameField"]');
  const lastName = Selector('[data-test="lastNameField"]');
  const phoneNumber = Selector('[data-test="phoneNumberField"]');

  const regNextBtn = await Selector('[data-test="nextCta"]');

  const address = Selector('[data-test="enterProfileAddress"]');
  const regZip = Selector('[data-test="zipCodeField"]');
  const checkTermsOfServiceCheckbox = Selector(
    '[data-test="regTermsCheckbox"]',
  );
  const skipForNowLink = Selector('[data-test="leadSuccessBtnNoAccount"]');
  const dealershipProfile = Selector('[data-test="dealershipProfileBlock"]');
  const pageInteractive = await Selector(
    '[data-test="pageIsInteractive"]',
  ).with({ visibilityCheck: true });

  if (t.browser.platform === "mobile") {
    await t
      .click(usedShopBtn.nth(1).with({ timeout: 30000 }))
      .expect(pageInteractive.exists)
      .ok({ timeout: 50000 })
      .click(mobileFilterMenuBtn)
      .click(zipcodeBtn)
      .typeText(zipcodeTextField, zip, { replace: true })
      .click(saveZipBtn)
      .click(mobileFooter)
      .expect(pageInteractive.exists)
      .ok({ timeout: 50000 });
  } else {
    await t
      .click(usedShopBtn.nth(0).with({ timeout: 30000 }))
      .expect(pageInteractive.exists)
      .ok({ timeout: 50000 })
      .click(zipcodeBtn)
      .selectText(zipcodeTextField)
      .pressKey("delete")
      .typeText(zipcodeTextField, zip)
      .click(saveZipBtn)
      .expect(pageInteractive.exists)
      .ok({ timeout: 50000 });
  }

  await t
    .expect(pageInteractive.exists)
    .ok({ timeout: 50000 })
    .expect(getPageUrl())
    .contains("/used-cars-for-sale/listings/", {
      timeout: 15000,
    })
    .expect(usedHeading.innerText)
    .contains("Used Cars for Sale")
    .click(firstVehicleListingCard);
  if (t.browser.platform === "mobile") {
    await t.click(mobileUnlockDealerBtn);
  } else {
    await t.click(unlockDealerBtn, { speed: 1 });
  }
  await t
    .click(continueAsGuest)
    .typeText(email, Faker.internet.email())
    .click(regNextBtn)
    .typeText(firstName, Faker.name.firstName())
    .typeText(lastName, Faker.name.lastName())
    .click(regNextBtn)
    .typeText(address, Faker.address.streetAddress(), { speed: 0.1 })
    .typeText(regZip, zip)
    .click(regNextBtn)
    .typeText(phoneNumber, phone)
    .click(checkTermsOfServiceCheckbox)
    .click(regNextBtn)
    .wait(5000) // More than enough time to prospect!
    .click(skipForNowLink)
    .expect(dealershipProfile.exists)
    .ok();
  let second_file_execution_end = new Date().getTime();
  test_data.test_end_time = second_file_execution_end;
  test_data.second_file_execution_time = (second_file_execution_end - second_file_execution_start)/1000;
  test_data.test_execution_time = (test_data.test_end_time - test_data.test_execution_started)/1000;
  console.log(test_data);
});

test("send Data to Sumo", async t => {
  (async () => {
    try{
        const uri = 'https://endpoint4.collection.sumologic.com/receiver/v1/http/ZaVnC4dhaV1cpd9ZEWxreFfcRJfASW7-kRZSAa2s36JCq6g1B0qRlSaqzhHJlPsJvl7UXIT_qhwXy-ICJbiGwyt2AuNbRouTzhXurWMLQXTHa8Em8nKkRw==';
        const body = test_data;
        const headers = null;
        const expectedStatusCode = 200;
        const response = await pushDataToSumo(uri, body, headers, expectedStatusCode);
        console.log('Response body: ', response.body);
    }catch(error){
        console.error('An error occurred while pushing data to Sumo:', error);
    }
  })();
});

async function pushDataToSumo(uri, body, headers, expectedStatusCode) {
  try {
    // Perform the PUT request using Axios
    const response = await axios.put(uri, body, { headers });

    // Check if the response status matches the expected status code
    if (response.status === expectedStatusCode) {
      console.log(`Request successful with status code: ${response.status}`);
    } else {
      console.error(`Expected status code ${expectedStatusCode}, but got ${response.status}`);
    }

    // Return the response for further processing or verification
    return response;
  } catch (error) {
    // Handle errors, including cases where the server responds with a status code outside the 2xx range
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Server responded with status code ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response was received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }

    throw error; // Rethrow the error for further handling if necessary
  }
}
// eslint-disable-next-line no-restricted-properties
const getPageUrl = ClientFunction(() => window.location.href);