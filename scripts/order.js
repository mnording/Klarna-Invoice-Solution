/**
 * Created by mattias.nording on 2016-09-28.
 */
$(document).ready(function()
{
    getMethodsforStore($("#purchasestore option:selected").val());
})
function getMethodsforStore(store)
{
    $('#paymentmethods').html("");
    $.get('api/'+store+'/methods',function(data)
    {
        $.each(data.payment_methods, function (i, item) {
            $('#paymentmethods').append($('<option>', {
                value: item.pclass_id,
                text : item.name+' '+item.title
            }));
        });
    })
}
$("#purchasestore").on("change",function()
{
    getMethodsforStore($("#purchasestore option:selected").val());
});
var CustomerAddresses;
$('#getadress').on('click',function()
{
    //$('#getadress').toggleClass('is-disabled');
    var pno  = $('#pno').val();
    var selectedstore = $("#purchasestore").val();
    $.get('api/'+selectedstore+'/adress/'+pno,function(data)
    {
        console.log(data);
        CustomerAddresses = data;
        setAdresses(CustomerAddresses[0]);
        $.each(data, function (i, item) {
            $('#adresses').append($('<option>', {
                value: i,
                text : item.firstname+' '+item.lastname+' '+item.street
            }));
        });

    })
});
$('#buy').on('click',function(e)
{
    e.preventDefault();
    var selectedstore = $("#purchasestore").val();
    //$(this).addClass("is-disabled");
    $.post('api/'+selectedstore+'/buy', $('#buyForm').serialize(),"json")
        .done(function(data)
        {
            if(data.invno)
            {
                $('.successdialog').show();
                $('#invoiceLabel').html(data.invno);
                $('#amountlabel').html(data.amount+' KR');
            }
        })
        .fail(function(data)
        {
            data = JSON.parse(data.responseText);
            $('.errordialog').show();
            $('#errormessage').html(data.message);

        })
})
$('#adresses').on('change',function()
{
    var value = $('#adresses option:selected' ).val();
    setAdresses(CustomerAddresses[value]);

})
function setAdresses(adress)
{
    $('#buy').removeClass('is-disabled');
    $('#selectedCustomer').html(adress.street+' '+adress.postal+' '+adress.city);
    $('#custname').val(adress.firstname);
    $('#custsurname').val(adress.lastname);
    $('#custstreet').val(adress.street);
    $('#custpostal').val(adress.postal);
    $('#custcity').val(adress.city);
}
$('#addNewProd').on('click',function()
{
    var copy = $('#orderLine').html();
    $('#orderLine').append(copy);
});
$('.successdialog .close').click(function () {
    $('.dialog').hide();
    window.location.reload();
});
$('.errordialog .close').click(function () {
    $('.dialog').hide();

});
$('#paymentmethods').on('change',function()
{
    var value = $('#paymentmethods option:selected' ).html();
    $('#selectedMethod').html(value);
});