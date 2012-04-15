var MeetAdvisorController = function MeetAdvisorController() {};

MeetAdvisorController.prototype = {

    _404: function(data) {
        data.page.file = "404";
    },

    login: function(data) {
		data.template.file = "simple";
        data.page.file = "login";
		
        meetadvisor.render(data, function() {
            
            new uiFieldsGroup();
        
            // Bind connect button
            $("#submit").click(function() {		
            
			    if ($("#login").val() == "" || $("#pwd").val() == "") {
				    alert("Merci d'entrer un login et un mot de passe.");
			    }
			    else {
				    var ws = new MeetAdvisorApi();
				    wsws.login($("#login").val(),$("#pwd").val());
			    }
            });
			
        });
    },

    createAccount: function(data) {

		data.template.file = "simple";
		data.page.file = "create-account";
		
		data.addPartial('header', 'header/default');
		data.addPartial('header', 'footer/tab-bar');

		meetadvisor.render(data, function() {
			new uiFieldsGroup();
        });

    },

    meetspots: function(data) {
        data.page.file = "meetspots";
		
		data.addPartial('header', 'header/default');
		data.addPartial('meetspotItem', 'list/item-meetspot');
		data.addPartial('header', 'footer/tab-bar');
		
        meetadvisor.render(data);
    },

    checkin: function(data) {
        data.page.file = "checkin";
		
		data.addPartial('header', 'header/default');
		data.addPartial('header', 'footer/tab-bar');
		
        meetadvisor.render(data);
    },

    profile: function(data) {
        data.page.file = "profile";
		
		data.addPartial('header', 'header/default');
		data.addPartial('header', 'footer/tab-bar');
		
        meetadvisor.render(data);
    },

    testMustache: function(data) {
        data.page.file = "test-mustache";

        // on ajoute un partial qui sera appelable par mustache dans le template
		data.addPartial('header', 'header/default');
		data.addPartial('meetspotItem', 'list/item-meetspot');
		data.addPartial('footer', 'footer/tab-bar');
		
        // on determine la data qui sera utilisee par mustache pour aficher le template
        data.data = {
            bars : [
                {name : "toto", type : "tutu"},
                {name : "pouet", type : "blup"},
                {name : "machin", type : "chose"},
                {name : "bidule", type : "42"},                
            ],
            title : "ceci est une page de test",
            context : {
                age_du_capitaine : 52,
                number_of_fucks_i_give : 0
            }
        };

        // on demande a render la page
        meetadvisor.render(data);
    },
};