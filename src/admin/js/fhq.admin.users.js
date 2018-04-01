if(!window.fhq) window.fhq = {};
if(!fhq.pages) fhq.pages = [];

fhq.createUser = function()  {
	fhq.showLoader();
	$('#error_info').hide();
	var data = {};
	data["role"] = $("#newuser_role").val();
	data["email"] = $("#newuser_login").val();
	data["password"] = $("#newuser_password").val();
	data["nick"] = $("#newuser_nick").val();
	data["university"] = $("#newuser_university").val();
	
	fhq.ws.user_create(data).done(function(r){
		fhq.hideLoader();
		fhq.pages['users']();
	}).fail(function(err){
		fhq.hideLoader();
		console.error(err);
		$('#error_info').show();
		$('#error_info .alert').html('ERROR: ' + err.error);
		
	})
};

fhq.deleteUser = function(el) {
	fhq.showLoader();
	$('#error_info').hide();
	var data = {};
	data["uuid"] = $(el).attr('uuid');
	data["password"] = $("#user_delete_admin_password").val();
	fhq.ws.user_delete(data).done(function(r){
		fhq.hideLoader();
		fhq.pages['users']();
		$('#modalInfo').modal('hide');
	}).fail(function(err){
		fhq.hideLoader();
		console.error(err);
		$('#error_info').show();
		$('#error_info .alert').html('ERROR: ' + err.error);
		$('#modalInfo').modal('hide');	
	})
}

fhq.pages['user_create'] = function(){
	fhq.changeLocationState({'user_create':''});
	$('#page_name').html('User Create');
	var el = $('#page_content');
	fhq.hideLoader();
	el.html(''
		+ '<div class="card">'
		+ '		<div class="card-header">New user</div>'
		+ '		<div class="card-body">'
		+ '			<div class="form-group row">'
		+ '				<label for="newuser_role" class="col-sm-2 col-form-label">Role</label>'
		+ ' 			<div class="col-sm-10">'
		+ '					<select class="form-control" value="" id="newuser_role">'
		+ '						<option value="user">User</option>'
		+ '						<option value="admin">Admin</option>'
		+ '					</select>'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row">'
		+ '				<label for="newuser_login" class="col-sm-2 col-form-label">Email or login</label>'
		+ ' 			<div class="col-sm-10">'
		+ '					<input type="text" class="form-control" value="" id="newuser_login">'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row">'
		+ '				<label for="newuser_password" class="col-sm-2 col-form-label">Password</label>'
		+ ' 			<div class="col-sm-10">'
        + '					<input type="text" class="form-control" value="" id="newuser_password">'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row">'
        + '				<label for="newuser_nick" class="col-sm-2 col-form-label">Nick</label>'
		+ ' 			<div class="col-sm-10">'
        + '					<input type="text" class="form-control" value="" id="newuser_nick">'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row">'
		+ '				<label for="newuser_university" class="col-sm-2 col-form-label">University (optional)</label>'
		+ ' 			<div class="col-sm-10">'
		+ '					<input type="text" class="form-control" value="" id="newuser_university">'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row">'
		+ '				<label class="col-sm-2 col-form-label"></label>'
		+ ' 			<div class="col-sm-10">'
		+ '					<div class="btn btn-secondary" onclick="fhq.createUser();">Create</div>'
		+ '				</div>'
		+ '			</div>'
		+ '			<div class="form-group row" id="error_info" style="display: none">'
		+ '				<label class="col-sm-2 col-form-label"></label>'
		+ ' 			<div class="col-sm-10">'
		+ '					<div class="alert alert-danger"></div>'
		+ '				</div>'
		+ '			</div>'
		+ '		</div>'
		+ '</div>'
	);
}

fhq.pages['users'] = function(){
	$('#page_name').html('Users');
	$('#page_content').html('');
	fhq.showLoader();
	
	var onpage = 5;
	if(fhq.containsPageParam("onpage")){
		onpage = parseInt(fhq.pageParams['onpage'], 10);
	}

	var page = 0;
	if(fhq.containsPageParam("page")){
		page = parseInt(fhq.pageParams['page'], 10);
	}
	
	var el = $("#page_content");
	el.html('Loading...')
	
	window.fhq.changeLocationState({'users': '', 'onpage': onpage, 'page': page});

	fhq.ws.users({'onpage': onpage, 'page': page}).done(function(r){
		fhq.hideLoader();
		
		el.html('');
        el.append('<button id="user_create" class="btn btn-secondary">Create User</button><hr>');
		$('#user_create').unbind().bind('click', fhq.pages['user_create']);
		
		

		el.append(fhq.paginator(0, r.count, r.onpage, r.page));
		el.append('<table class="table table-striped">'
			+ '		<thead>'
			+ '			<tr>'
			+ '				<th>#</th>'
			+ '				<th>Email / Nick</th>'
			+ '				<th>Last IP <br> Country / City / University</th>'
			+ '				<th>Last Sign in <br> Status / Role</th>'
			+ '				<th>Actions</th>'
			+ '			</tr>'
			+ '		</thead>'
			+ '		<tbody id="users_list">'
			+ '		</tbody>'
			+ '</table>'
		)
		for(var i in r.data){
			var u = r.data[i];
			$('#users_list').append('<tr>'
				+ '	<td><p>' + u.id + '</td>'
				+ '	<td><p>' + u.email + '</p><p>'  + u.nick + '</p></td>'
				+ '	<td><p>' + u.last_ip + '</p><p>' + u.country + ' / ' + u.city + ' / ' + u.university + '</p></td>'
				+ '	<td><p>' + u.dt_last_login + '</p><p>' + '' + u.role + '</p></td>'
				+ '	<td><p><button class="btn btn-secondary user_delete" uuid=' + u.uuid + '>Delete User</button><hr></p></td>'
				+ '</tr>'
			)
		}
		
		$('.user_delete').unbind().bind('click', function(){
			console.warn('user_delete');
			var uuid = $(this).attr('uuid');
			
			$('#modalInfoTitle').html('User {' + uuid + '} confirm deletion');
			$('#modalInfoBody').html('');
			$('#modalInfoBody').append(''
				+ 'Admin password:'
				+ '<input class="form-control" id="user_delete_admin_password" type="password"><br>'
				+ '<div class=" alert alert-danger" style="display: none" id="user_delete_error"></div>'
			);
			$('#modalInfoButtons').html(''
				+ '<button type="button" class="btn btn-secondary" id="user_delet_btn" uuid="' + uuid + '" onclick="fhq.deleteUser(this);">Delete</button> '
				+ '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
			);
			$('#modalInfo').modal('show');
		});

		el.append('<div class="form-group row" id="error_info" style="display: none">'
		+ ' 			<div class="col-sm-10">'
		+ '					<div class="alert alert-danger"></div>'
		+ '				</div>'
		+ '			</div>');
		
	}).fail(function(r){
		fhq.hideLoader();
		console.error(r);
		el.append(r.error);
	})
}

