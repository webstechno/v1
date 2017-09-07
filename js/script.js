$(document).ready(function(e) {

    if ($.cookie('rechargeOffer') == null) {
    	$('#rechargeOffer').modal('show');
    	$.cookie('rechargeOffer', 1);
    }

    $('#inputAmount').keyup(function() {
        var amount = parseFloat($(this).val());
        var cashback = 0;
        if (amount > 4999 && amount <= 9999) cashback = (amount * 0.03);
        else if (amount > 9999) cashback = (amount * 0.035);
        if(amount > 4999) $('#inputCreditAmount').val((amount + cashback).toFixed(2));
        else $('#inputCreditAmount').val(0);
    });

    $('#forgotpasswordModal form').submit(function(event) {
        if ($('#inputotp').val().length != 6) {
            event.preventDefault();
            $('[value="confirm"]').html('Validating..').attr('disabled', 'true');
            var form = this;
            $.get(BASE_URL + '/api/recoverpassword/' + $('#mobilenumberInput').val(), function(d) {
                if (d.status == true) {
                    $('#mobilenumberInput').attr('readonly', 'true');
                    $('[value="confirm"]').slideUp('slow');
                    $('#otp-form').removeClass('hidden').slideDown('slow');
                    $('#inputotp').attr('required', 'true');
                    $('#helpBlock').remove(this);
                } else {
                    $('[value="confirm"]').html('Confirm').removeAttr('disabled');
                    $('#forgotpasswordModal form').prepend('<div class="alert alert-warning alert-dismissible fade in" role=alert> <button type=button class=close data-dismiss=alert aria-label=Close><span aria-hidden=true>&times;</span></button>' + d.message + '</div>');
                }
            }, 'json');
        }
    });

    $('[name="usewallet"]').change(function() {
        if ($(this).is(':checked')) $('[name="action"]').html('PAY ' + $(this).data('wallet'));
        else $('[name="action"]').html('PAY ' + $(this).data('pay'));
    });

    $('#Prepaid [name="number"]').keyup(function() {
        if ($(this).val().length == 4) {
            $.post(BASE_URL + '/api/provider', { number: $(this).val(), type: 'prepaid' }, function(d) {
                if ($('#Prepaid [name="operator"]').val() == '') {
                    $('#Prepaid [name="operator"]').val(d.operator);
                    if (d.operator == 3) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="3" checked>TopUp</label><label class="radio-inline"><input type="radio" name="operator" value="4">Validity</label><label class="radio-inline"><input type="radio" name="operator" value="74">3G</label><label class="radio-inline"><input type="radio" name="operator" value="75">Special</label></div>');
                    if (d.operator == 14) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="14" checked>Uninor</label><label class="radio-inline"><input type="radio" name="operator" value="15">Uninor Special</label></div>');
                    else $('#special').html('');
                }
                if ($('#Prepaid [name="circle"]').val() == '') $('#Prepaid [name="circle"]').val(d.circle);
            }, 'json');
        }
        if ($(this).val().length == 10) {
            $('#Prepaid [name="amount"]').focus();
        }
    });

    $('#Postpaid [name="number"]').keyup(function() {
        if ($(this).val().length == 4) {
            $.post(BASE_URL + '/api/provider', { number: $(this).val(), type: 'postpaid' }, function(d) {
                if ($('#Postpaid [name="operator"]').val() == '') $('#Postpaid [name="operator"]').val(d.operator);
                if ($('#Postpaid [name="circle"]').val() == '') $('#Postpaid [name="circle"]').val(d.circle);
            }, 'json');
        }
        if ($(this).val().length == 10) {
            $('#Postpaid [name="amount"]').focus();
        }
    });

    $('form.guest').submit(function(event) {
        event.preventDefault();
        var thisform = $(this);
        $.post(BASE_URL + '/api/user', thisform.serialize(), function(d) {
            if (d.status == true) thisform.submit();
            else $('#loginModal').modal('show');
        }, 'json');
    });

    $("#promo button[type=button]").click(function() {
        var thisbutton = $(this);
        if (thisbutton.html() == 'Remove') {
            $('[name="promocode"]').removeAttr('readonly').val('');
            thisbutton.html('Apply');
        } else {
            var c = $('[name="promocode"]').val();
            var t = $('[name="type"]').val();
            if (c.length > 3) {
                $('#promoAlert').html('Validating..');
                $.post(BASE_URL + '/api/promocode', { code: c, type: t }, function(d) {
                    if (d) $('#promoAlert').html('<div class="alert alert-' + d.s + ' alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> ' + d.m + '</div>').slideDown('slow');
                    if (d.s == 'danger') $('[name="promocode"]').val('');
                    if (d.s == 'success') {
                        $('[name="promocode"]').attr('readonly', 'true');
                        thisbutton.html('Remove');
                    } else {}
                }, 'json');
            } else $('#promoAlert').html('<div class="alert alert-warning alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> Warning!! Coupon code must have 4 charecter.</div>').slideDown('slow');
        }
    });

    $('#Prepaid [name="amount"]').focus(function() {
        var operator = $('#Prepaid [name="operator"]').val();
        var circle = $('#Prepaid [name="circle"]').val();
        if (operator != '' && circle != '') {
            $.post(BASE_URL + '/api/plans', { type: 'prepaid', operator: operator, circle: circle }, function(data) {
                $('#sidebar').html(data);
            });
        }
    });

    $('#DTH [name="amount"]').focus(function() {
        var operator = $('#DTH [name="operator"]').val();
        if (operator != '') {
            $.post(BASE_URL + '/api/plans', { type: 'dth', operator: operator }, function(data) {
                $('#sidebar').html(data);
            });
        }
    });

    $('[name="operator"]').change(function() {
        var operator = $(this);
        if (operator.val() == 3) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="3" checked>TopUp</label><label class="radio-inline"><input type="radio" name="operator" value="4">Validity</label><label class="radio-inline"><input type="radio" name="operator" value="74">3G</label><label class="radio-inline"><input type="radio" name="operator" value="75">Special</label></div>');
        else if (operator.val() == 4) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="3">TopUp</label><label class="radio-inline"><input type="radio" name="operator" value="4" checked>Validity</label><label class="radio-inline"><input type="radio" name="operator" value="74">3G</label><label class="radio-inline"><input type="radio" name="operator" value="75">Special</label></div>');
        else if (operator.val() == 74) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="3">TopUp</label><label class="radio-inline"><input type="radio" name="operator" value="4">Validity</label><label class="radio-inline"><input type="radio" name="operator" value="74" checked>3G</label><label class="radio-inline"><input type="radio" name="operator" value="75">Special</label></div>');
        else if (operator.val() == 75) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="3">TopUp</label><label class="radio-inline"><input type="radio" name="operator" value="4">Validity</label><label class="radio-inline"><input type="radio" name="operator" value="74">3G</label><label class="radio-inline"><input type="radio" name="operator" value="75" checked>Special</label></div>');

        else if (operator.val() == 14) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="14" checked>Uninor</label><label class="radio-inline"><input type="radio" name="operator" value="15">Uninor Special</label></div>');
        else if (operator.val() == 15) $('#special').html('<div class="form-group"><label class="radio-inline"><input type="radio" name="operator" value="14">Uninor</label><label class="radio-inline"><input type="radio" name="operator" value="15" checked>Uninor Special</label></div>');

        else if (operator.val() == 51 || operator.val() == 82) $('#extra').html('<div class="form-group has-feedback"><input type="text" name="extra[cycle]" class="form-control" id="cycleInput" placeholder="Enter Cycle" required><span class="glyphicon form-control-feedback" aria-hidden="true"></span></div>');

        else $('#special, #extra').html('');
    });

});

function amount(amt) {
    $('[name=amount]').val(amt).blur();
}