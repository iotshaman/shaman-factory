function onClickSubmitForm() {
  let values = getFormValues();
  let form = {
    formUuid: $("#form_uuid").val(),
    values: values
  };
  submitForm(form).then(rslt => submitFormActions(rslt));
}

function getFormValues() {
  let values = [];
  $(".form-group").each(function(_, group) {
    let label = $("label", group).html();
    let elem = $(".form-control", group);
    let uuid = elem.attr('data-uuid');
    let value = elem.val();
    values.push({
      inputUuid: uuid,
      label: label,
      value: value
    });
  });
  return values;
}

function submitForm(form) {
  let options = { 
    method: 'POST', 
    body: JSON.stringify(form),
    headers: defaultHeaders
  }
  return fetch(`${apiBaseUri}/form/submit`, options)
    .then(catchFetchError)
    .then(rslt => rslt.json());
}

function submitFormActions(form) {
  let actions = getFormActions();
  Promise.all(actions.map(a => submitFormAction(form, a)));
}

function getFormActions() {
  let actions = [];
  $("input.form-action").each(function(_, action) {
    actions.push($(action).val());
  });
  return actions;
}

function submitFormAction(form, action) {
  form.action = action;
  let options = { 
    method: 'POST', 
    body: JSON.stringify(form),
    headers: defaultHeaders
  }
  return fetch(`${apiBaseUri}/form/action`, options)
    .then(catchFetchError)
    .then(res => { return res.status == 201 ? res.blob() : Promise.resolve(null) })
    .then(blob => {
      if (!blob) return;
      var file = window.URL.createObjectURL(blob);
      window.open(file, '_blank');
    })
}