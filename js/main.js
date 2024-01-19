jQuery(document).ready(function ($) {
    if ($('.js-select').length) {
        $('.js-select').select2({
            placeholder: 'בחירת מרכז',
            minimumResultsForSearch: Infinity
        });
    }


    var recaptcha_key = '6LeO_wUeAAAAAM-RSEl7he8E2aaBi7D78cRkj5od',
        form = $('form');

    // grecaptcha.ready(() => { reloadRecaptcha(); });


    $("input, select").on('change', function (e) {
        $(this).removeClass('is-invalid');
        $(this).parent().find('.invalid-feedback').text('');
    })


    form.attr('novalidate', 'novalidate');
    form.submit(function (e) {
        e.preventDefault();

        let fname = $(this).find('input[name="fname"]'),
            fphone = $(this).find('input[name="fphone"]'),
            funit = $(this).find('select[name="funit"]'),
            // frecaptcha = $(this).find('.recaptchaResponse'),
            validForm = true;

        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');

        //validate fname field
        let fname_val = fname.val().trim();
        if (!fname_val) {
            fname.addClass('is-invalid');
            if (validForm) {
                fname.focus();
            }

            fname.parent().find('.invalid-feedback').text('נא להזין את שם פרטי');

            validForm = false;
        }else {
            fname.addClass('is-valid');
        }

        //validate fphone field
        let fphone_val = fphone.val().trim();
        if (!fphone_val) {
            fphone.addClass('is-invalid');
            if (validForm) {
                fphone.focus();
            }

            fphone.parent().find('.invalid-feedback').text('נא להזין את מספר הטלפון');

            validForm = false;
        } else if (!validateTel(fphone_val)) {
            fphone.addClass('is-invalid');
            if (validForm) {
                fphone.focus();
            }

            fphone.parent().find('.invalid-feedback').text("מספר שגוי");

            validForm = false;
        } else {
            fphone.addClass('is-valid');
        }

        //validate funit field
        if (!funit.val()) {
            funit.addClass('is-invalid');
            if (validForm) {
                funit.focus();
            }

            funit.parent().find('.invalid-feedback').text('אנא בחר מרכז');

            validForm = false;
        } else {
            funit.addClass('is-valid');
        }

        if (validForm) {
            var formData = new FormData();
            $("button[type='submit']").hide();
            form.addClass('loading');

            formData.append('fname', fname.val());
            formData.append('fphone', fphone.val());
            formData.append('funit', funit.val());
            // formData.append('recaptcha_response', frecaptcha.val());

            $.ajax({
                method: "POST",
                url: form.attr('action'),
                dataType: "json",
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
            })
                .done(function (data) {
                    console.log(data);

                    if (data && data.result_code) {
                        if (data.result_code == '119') {
                            clearFormFields();

                            window.location = 'thanks.html';
                        } else if (data.result_code == '100') {
                            var conf = confirm("מערכת אבטחת האתר מצריכה בדיקה שאינך רובוט. נא ללחוץ על כפתור האישור.");
                            if (conf == true) {
                                formData.append('conf_key', data.result);
                                $.ajax({
                                    method: "POST",
                                    url: form.attr('action'),
                                    dataType: "json",
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    data: formData,
                                })
                                    .done(function (data) {
                                        if (data && data.result_code) {
                                            if (data.result_code == '119') {
                                                clearFormFields()

                                                window.location = 'thanks.html';
                                            } else if (data.result_code == '100') {
                                                alert('שגיאה: נתונים חסרים או לא תקינים');
                                                $("button[type='submit']").show();
                                                form.removeClass('loading');
                                            } else {
                                                alert(data.result);
                                                $("button[type='submit']").show();
                                                form.removeClass('loading');
                                            }
                                        }

                                        // reloadRecaptcha();
                                    })
                            } else {
                                // reloadRecaptcha();

                                $("button[type='submit']").show();
                                form.removeClass('loading');
                            }
                        } else {
                            alert(data.result);
                            $("button[type='submit']").show();
                            form.removeClass('loading');
                        }
                    }
                });
        }
    });


    function validateTel(tel) {
        let pattern = /^([0-9]{10})$/;
        return pattern.test(tel);
    }

    // function reloadRecaptcha() {
    //     grecaptcha.execute(recaptcha_key, { action: 'contact' }).then(function (token) {
    //         var recaptchaResponse = document.querySelectorAll(".recaptchaResponse");
    //         recaptchaResponse.forEach(function (recaptchaItem) {
    //             recaptchaItem.value = token;
    //         });
    //     })
    // }

    function clearFormFields() {
        $('input[type!=checkbox], select, textarea').each((index, item) => {
            $(item).val('');
        })

        $('input[type=checkbox]').each((index, item) => {
            $(item).prop('checked', false);
        })
    }

});