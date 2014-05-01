var websocket = io.connect();
$(document).on("ready",function(){

	if(localStorage.chatName)
		websocket.emit("enviarUsuario", localStorage.chatName);	
	else
		$('#myModal').modal('show');
			
	//Envia el mensaje al server
	$("#formSend").on("submit", function(e){
		e.preventDefault();
		websocket.emit("enviarMensaje", $("#msg").val().replace("<","&lt;"));
		$("#msg").val('');
		$("#msg").focus();

	});

	//Agrega los mensajes al chat
	websocket.on("cargarMensaje", function(msg){
		$("#chatInsite").append("<strong>" + msg[0] + "</strong> " + msg[1] + "<br />");
		$('#chat').animate( { scrollTop: $("#chatInsite").height() }, 500 );
	});

	//Obitiene el usuario error
	websocket.on("errorUsuario", function(){
		$(".alert").fadeIn();
	});

	//Enviar el usuario al server
	$("#formUser").on("submit", function(e){
		e.preventDefault();
		if(localStorage)
			localStorage.chatName = $("#userName").val();
		websocket.emit("enviarUsuario", $("#userName").val());
	});
	
	//Obitiene el usuario
	websocket.on("usuario", function(users){
		$('#myModal').modal('hide');
		$("#users").html('');
		$(".lblUser").html('  ' + localStorage.chatName);

		$.each(users, function(index, value){
			$("#menu-users").append("<li><a href='#'>" + value + "</a></li>");
		});
	});

	//Obtiene cuando un usuario se desconecta
	websocket.on("userDisconnect", function(users){
		$("#users").html('');
		$.each(users, function(index, value){
			$("#menu-users").append("<li><a href='#'>" + value + "</a></li>");
		});
	});
	

	//$(window).on("resize", function(){
		$("#chat").height($(window).height() - 200);
	//});
});


//e.preventDefault();