

insert into config (app_id, config_id, config_data)
values ('registration','application',
      '{ "appUrl" : "http://localhost:8080" }'
);
	  
insert into config (app_id, config_id, config_data)
values ('registration','db_user_manager',
      '{
	"url" : "jdbc:mysql://localhost:3306/user_manager", 
	"username" : "YOURUSERNAME",
	"password" : "YOURPASSWORD"
	}'
);

insert into config (app_id, config_id, config_data)
values ('registration','keycloak',
      '{
	"auth-server-url" : "https://devauth.discoverydataservice.net/auth",
	"public-client" : true,
	"realm" : "endeavour2",
	"realm-public-key" : "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvi7bZ3cX5wA412sbm0Rk2aAuOEjZuMdrSnRtSDCsebVzu4MLu+HZlbYLt7Mpswnc1/MJnatJE+zoraVhkNNrikKTImp2AraCFgz5cf2Xw2M6yRNSSeLatN8E4k8cMAThD7pKzbvRUOuX8l3ez0TssMNvhzEksEDcqVhb5hRE3AHhmkXHeBtqrwG0S+RpOmp5UWeOLy3Zi9QNAACkOd0a1aE65frW0Wm2QXVHeII1AqKLi99f60ktMwhC36DYlzb6aqTiquixl8/mnkZB0Yh82/7xTbqKzdI+yeCFGdUrkELBmg03bjogf0BaWa7yv4vG6mKPgr5iDkrxLZYd+8z9ZQIDAQAB",
	"resource" : "information-manager",
	"ssl-required" : "external"
}'
);

insert into config (app_id, config_id, config_data)
values ('registration','keycloak_proxy',
      '{
  "user" : "eds-ui",
  "pass" : "bd285adbc36842d7a27088e93c36c13e29ed69fa63a6",
  "url" : "https://devauth.endeavourhealth.net/auth"
}'
);

insert into config (app_id, config_id, config_data)
values ('registration','settings',
      '{
    "organisation_id" : "439e9f06-d54c-3eb6-b800-010863bf1399",
    "project_id" : "fd2b2ec4-f623-40e2-a65a-739a6b0f1637",
    "application_policy_id" : "d86fa19c-6561-48a6-8ef9-ea00268710f4",
    "region_id" : "98cc873e-0c3b-4983-aabf-42acc60aa6db"
}'
);
