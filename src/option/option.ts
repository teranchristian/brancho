document.addEventListener('DOMContentLoaded', () => {
  const issueKeyCaseRadios = document.getElementsByName(
    'issueKeyCase'
  ) as NodeListOf<HTMLInputElement>;
  const issueSummaryCaseRadios = document.getElementsByName(
    'issueSummaryCase'
  ) as NodeListOf<HTMLInputElement>;
  const previewElement = document.getElementById('preview') as HTMLElement;
  const issueKeyBtn = document.getElementById('issueKeyBtn') as HTMLElement;
  const issueSummaryBtn = document.getElementById(
    'issueSummaryBtn'
  ) as HTMLElement;
  const issueKeyUpper = document.getElementById(
    'issueSummaryUpper'
  ) as HTMLInputElement;
  const issueKeyLower = document.getElementById(
    'issueSummaryLower'
  ) as HTMLInputElement;
  const saveBtn = document.getElementById('save') as HTMLElement;

  const loader = document.querySelector('.loader') as HTMLElement;

  let issueKeySelected = true;
  let savedIssueSummaryCase: string | undefined = undefined;

  function updatePreview() {
    let issueKey = 'ABC-3504';
    let issueSummary = '-new-adcampaign-endpoint';

    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
      (radio) => radio.checked
    )?.value;

    if (selectedIssueKeyCase === 'upper') issueKey = issueKey.toUpperCase();
    if (selectedIssueKeyCase === 'lower') issueKey = issueKey.toLowerCase();
    if (selectedIssueSummaryCase === 'upper')
      issueSummary = issueSummary.toUpperCase();
    if (selectedIssueSummaryCase === 'lower')
      issueSummary = issueSummary.toLowerCase();

    if (!issueSummaryBtn.classList.contains('selected')) {
      issueSummary = '';
    }
    previewElement.textContent = `${issueKey}${issueSummary}`;
  }

  function toggleIssueKeyCaseOptions(enable: boolean) {
    if (!enable) {
      savedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
        (radio) => radio.checked
      )?.value;
      issueKeyUpper.checked = false;
      issueKeyLower.checked = false;
    } else if (typeof savedIssueSummaryCase === 'string') {
      const radioToRestore = Array.from(issueSummaryCaseRadios).find(
        (radio) => radio.value === savedIssueSummaryCase
      );
      if (radioToRestore) radioToRestore.checked = true;
    }

    issueKeyUpper.disabled = !enable;
    issueKeyLower.disabled = !enable;
  }

  issueSummaryBtn.addEventListener('click', () => {
    issueKeySelected = !issueKeySelected;
    toggleIssueKeyCaseOptions(issueKeySelected);

    issueSummaryBtn.classList.toggle('selected');
    updatePreview();
  });

  saveBtn.addEventListener('click', () => {
    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
      (radio) => radio.checked
    )?.value;

    console.log('Selected Issue Key Case:', selectedIssueKeyCase);
    console.log('Selected Issue Summary Case:', selectedIssueSummaryCase);

    // setTimeout(() => {
    // saveBtn.style.visibility = 'hidden'; // Hide the save message after 3 seconds

    loader.classList.add('active');
    setTimeout(() => {
      loader.classList.remove('active');
      // saveBtn.style.visibility = 'visible'; // Show the save message
    }, 3000);
    // }, 1000); // Simulating a delay of 1 second for the save action
  });

  issueKeyCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );
  issueSummaryCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );

  updatePreview();
});
