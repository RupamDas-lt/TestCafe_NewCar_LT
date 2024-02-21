import { Selector, RequestLogger, RequestMock, ClientFunction } from "testcafe";
import { test_data } from '../../tests/testData';
import { config } from "../../config";

test_data.test_start_time = new Date().getTime();
const mockTealiumTracking = RequestMock()
  .onRequestTo(request => {
    return request.url.indexOf("https://tags.tiqcdn.com/utag/truecar/") > -1;
  })
  .respond((req, res) => {
    res.setBody("<html><body><h1>OK</h1></body></html>");
  });

const dealershipSelectionRequest = RequestLogger(
  /abp\/api\/consumers\/builds\/([0-9A-Za-z-]{9})\/dealership_selection/,
  {
    logResponseHeaders: true,
    logResponseBody: true,
  },
);

fixture("New Car Lead Submission")
  .page("https://www.qa.truecardev.com/")
  .requestHooks(dealershipSelectionRequest, mockTealiumTracking);

test('Small test only using get Cookies', async t => {
  let firstCommandExecutionStart = new Date().getTime();
  await t
      .getCookies();
  test_data.test_execution_started = new Date().getTime();
  let setuptime = (test_data.test_execution_started - test_data.test_start_time) / 1000;
  test_data.first_command_execution_time = (test_data.test_execution_started - firstCommandExecutionStart) / 1000;
  test_data.driver_setup_time = setuptime;
});

test("can submit new car lead", async t => {
  const makeSlug = "bmw";
  const modelSlug = "3-series";
  const zipCode = "90401";

  const Faker = require("faker");
  const password = "!SolG00dMan!";
  const phone = `213343${Faker.phone.phoneNumber("####")}`;
  const shopNewBtn = await Selector(
    '[data-test="homepageHeroPanelShopNewButton"]',
  ).with({ visibilityCheck: true });
  const make = await Selector(
    `[data-test="shopMakeModelMakeListTab"][data-test-item="${makeSlug}"]`,
  );

  const model = await Selector(
    `[data-test="shopNewMakeModelSelectItem"][data-test-item="${modelSlug}"]`,
  );
  const zip = await Selector('[data-test="zipCodeTextBox"]').with({
    visibilityCheck: true,
  });
  const shopMakeModelZipInputNextBtn = await Selector(
    '[data-test="zipSubmit"]',
  );

  const nextBtn = await Selector('[data-test="nextButton"]');
  const chooseDefaultBuildBtn = await Selector(
    '[data-test="defaultBuildCard"]',
  );
  const levelSetNextBtn = await Selector('[data-test="nextCta"]');
  const truePriceBtn = await Selector('[data-test="bxReviewRegisterCta"]')
    .find('[data-test="vehicleHeaderTruepriceCtaButton"]')
    .with({ visibilityCheck: true });

  const emailInput = Selector('[data-test="regEmailField"]');
  const submitBtn = await Selector('[data-test="submitButton"]');
  const passwordInput = Selector('[data-test="regPasswordField"]');

  const checkTermsOfServiceCheckbox = await Selector(
    '[data-test="regTermsCheckbox"] [data-test="checkboxIndicator"]',
  );

  const firstNameInput = Selector('[data-test="firstNameField"]');
  const lastNameInput = Selector('[data-test="lastNameField"]');

  const phoneInput = Selector('[data-test="phoneNumberField"]');
  const addressInput = Selector('[data-test="enterProfileAddress"]');
  const nextCta = await Selector('[data-test="nextCta"]');

  const pageInteractive = await Selector(
    '[data-test="pageIsInteractive"]',
  ).with({ visibilityCheck: true });

  const unlockFooterBtn = await Selector('[data-test="unlockFooterCta"]');
  const bestMatches = await Selector(
    '[data-test="bestMatchesContainer"]',
  ).with({ visibilityCheck: true });

  await t.expect(pageInteractive.exists).ok({ timeout: 50000 });
  if (t.browser.platform === "mobile") {
    await t
      .expect(shopNewBtn.nth(1).exists)
      .ok({ timeout: 30000 })
      .click(shopNewBtn.with({ timeout: 40000 }).nth(1));
  } else {
    await t
      .expect(shopNewBtn.nth(0).exists)
      .ok({ timeout: 30000 })
      .click(shopNewBtn.with({ timeout: 40000 }).nth(0));
  }
  await t
    .expect(getPageUrl())
    .contains("/shop/new/?filterType=brand", { timeout: 30000 })
    .click(make)
    .click(model)
    .typeText(zip, zipCode)
    .click(shopMakeModelZipInputNextBtn)
    .expect(pageInteractive.exists)
    .ok({ timeout: 10000 })
    .click(chooseDefaultBuildBtn)
    .click(levelSetNextBtn)
    .expect(pageInteractive.exists)
    .ok({ timeout: 10000 })
    .expect(getPageUrl())
    .contains("/build/", { timeout: 20000 });
  await t.click(truePriceBtn);
  await t
    .typeText(
      emailInput,
      `testcafe+${Math.floor(Math.random() * 10000000)}@truecar.com`,
    )
    .pressKey("tab")
    .click(submitBtn)
    .typeText(passwordInput, password)
    .click(submitBtn)
    .expect(pageInteractive.exists)
    .ok({ timeout: 50000 })
    .typeText(firstNameInput, Faker.name.firstName())
    .pressKey("tab")
    .typeText(lastNameInput, Faker.name.lastName())
    .pressKey("tab")
    .click(nextCta)
    .typeText(addressInput, Faker.address.streetAddress(), { speed: 0.1 })
    .pressKey("tab") // tabs are necessary for mobile web to move focus on the CTA
    .click(nextCta)
    .typeText(phoneInput, phone)
    .pressKey("tab")
    .click(checkTermsOfServiceCheckbox)
    .expect(nextCta.visible)
    .ok({ timeout: 20000 })
    .click(nextCta)
    .expect(pageInteractive.exists)
    .ok({ timeout: 60000 })
    .expect(getPageUrl())
    .contains("unlock-dealer-success/", { timeout: 40000 })
    .pressKey("tab")
    .expect(nextBtn.exists)
    .ok({ timeout: 40000 })
    .click(nextBtn)
    .expect(
      dealershipSelectionRequest.contains(r => r.response.statusCode === 200),
    )
    .ok({ timeout: 40000 })
    .expect(getPageUrl())
    .contains("/unlock-dealers/", { timeout: 20000 })
    .click(unlockFooterBtn)
    .expect(pageInteractive.exists)
    .ok({ timeout: 50000 })
    .expect(getPageUrl())
    .contains("/dashboard/", { timeout: 20000 })
    .expect(bestMatches.exists)
    .ok({ timeout: 30000 });
  let firstFileExecutionFinished = new Date().getTime();
  test_data.first_file_execution_time = (firstFileExecutionFinished - test_data.test_execution_started)/1000;
});

// eslint-disable-next-line no-restricted-properties
const getPageUrl = ClientFunction(() => window.location.href);
