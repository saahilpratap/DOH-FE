export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			'items': [
				{
					'title': 'Assessments',
					'root': true,
					'icon-': 'flaticon-add',
					'toggle': 'click',
					'custom-class': 'kt-menu__item--active',
					'alignment': 'left',
					'url':'assessments',
					submenu: []
				},
				{
					'title': 'Incidents',
					'root': true,
					'icon-': 'flaticon-line-graph',
					'toggle': 'click',
					'alignment': 'left',
					'url':'incident_reporting',
					submenu: []
				},
				{
					'title': 'Exceptions',
					'root': true,
					'icon-': 'flaticon-paper-plane',
					'toggle': 'click',
					'alignment': 'left',
					'url':'exceptions_management',
					submenu: []
				},
				{
					'title': 'Business Risks',
					'root': true,
					'icon-': 'flaticon-paper-plane',
					'toggle': 'click',
					'alignment': 'left',
					'url':'business-risks',
					submenu: []
				}
			]
		},
		aside: {
			self: {},
			items: [
				/**
				 * Home
				 */
				{
					title: 'Home',
					submenu: [
						{
							title: 'Dashboard - Authority',
							root: true,
							bullet: 'dot',
							page: 'dot',
						},
						{
							title: 'Dashboard - Entity',
							root: true,
							bullet: 'dot',
							page: 'dot',
						},
						{
							title: 'Dashboard - Auditor',
							root: true,
							bullet: 'dot',
							page: 'dot',
						},

					]

				},
				/**
				 * Section Organization Setup
				 */
				{
					title: 'Organisation Setup',
					submenu: [
						{
							title: 'Authority Info',
							root: true,
							bullet: 'dot',
							page: 'authority_info'
						},
						{
							title: 'All Employees',
							root: true,
							bullet: 'dot',
							page: 'all_employees'
						},

					]

				},



				/**
				 * Business Entities
				 */
				{
					title: 'Business Entities',
					submenu: [
						{
							title: 'All Entities',
							root: true,
							bullet: 'dot',
							page: 'ecommerce/customers'
						},
						{
							title: 'All Assessments',
							root: true,
							bullet: 'dot',
							page: 'assessments'
						},
						{
							title: 'All Contacts',
							root: true,
							bullet: 'dot',
						},





					]
				},

				/**
				 * Section Complaince Management
				 */
				// {
				// 	title: 'Complaince Management',
				// 	submenu : [
				// 		{
				// 			title: 'All Authoratative Document',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 		{
				// 			title: 'All AD Domains',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 		{
				// 			title: 'Control Standards Report',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 		{
				// 			title: 'All Control Requirements',
				// 			bullet: 'dot',
				// 			page: 'all_employees'
				// 		},
				// 	]

				// },
				/**
				 * Section Complaince Management
				 */
				{
					title: 'Complaince Management',
					submenu: [
						{
							title: 'All Authoratative Document',
							root: true,
							bullet: 'dot',
							page: 'all_authoratative_document'
						},
						{
							title: 'All AD Domains',
							root: true,
							bullet: 'dot',
							page: 'all_ad_domains'
						},
						{
							title: 'Control Standards Report',
							root: true,
							bullet: 'dot',
							page: 'control_standards_report'
						},
						{
							title: 'All Control Requirements',
							root: true,
							bullet: 'dot',
							page: 'all_control_requirements'
						},
					]
				},
				/**
				 *  Section Assessments Reporting
				 */
				// {
				// 	title: 'Assessments Reporting',
				// 	submenu: [
				// 		{
				// 			title: 'Assessments',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'assessments'
				// 		},
				// 		{
				// 			title: 'All Assessments',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'all_assessments'
				// 		},
				// 		{
				// 			title: 'Business Risks',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'business-risks'
				// 		},
				// 		{
				// 			title: 'All Business Risks',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 		{
				// 			title: 'Review Database',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'review_database'
				// 		},
				// 		{
				// 			title: 'All Review Database',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 	]
				// },
				/**
				 *  Section Audit Management
				 */
				{
					title: 'Audit Management',
					submenu: [
						// {
						// 	title: 'Audit Vendors',
						// 	root: true,
						// 	bullet: 'dot',
						// 	page: 'audit_vendors'

						// },
						{
							title: 'Audit Vendor Info',
							root: true,
							bullet: 'dot',
							page: 'audit_vendors'

						},
						{
							title: 'New External Assessment',
							root: true,
							bullet: 'dot',
							page: 'external_assessments'

						},
						{
							title: 'All External Assessments',
							root: true,
							bullet: 'dot',
							page: 'all_external_assessments'
						},

					]
				},
				/**
				 * Section Administration
				 */
				{
					title: 'Administration',
					submenu: [
						{
							title: 'System Setup',
							root: true,
							bullet: 'dot',
							page: 'system_setup'

						},
						{
							title: 'All Notifications',
							root: true,
							bullet: 'dot',
							page: 'all_notifications'
						},
						{
							title: 'All Application Configurations',
							root: true,
							bullet: 'dot',
							page: 'all_applications_configuration'
						},
						{
							title: 'User Management',
							root: true,
							bullet: 'dot',
							submenu: [
								{
									title: 'Users',
									page: 'user-management/users'
								},
								{
									title: 'Roles',
									page: 'user-management/roles'
								}
							]
						},

					]
				},
				/*{section: 'Applications'},
				{
					title: 'eCommerce',
					bullet: 'dot',
					icon: 'flaticon2-list-2',
					root: true,
					permission: 'accessToECommerceModule',
					submenu: [
						{
							title: 'Customers',
							page: 'ecommerce/customers'
						},
						{
							title: 'Products',
							page: 'ecommerce/products'
						},
					]
				},
				*/
				/*
				 * Section Exceptions Reporting
				 */
				// {
				// 	title: 'Exceptions Management',
				// 	submenu: [
				// 		{
				// 			title: 'Exceptions Management',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'exceptions_management'
				// 		},
				// 		{
				// 			title: 'Exceptions Management Report',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 	]
				// },

				/**
				 * Section Incident Management
				 */
				// {
				// 	title: 'Incident Management',
				// 	submenu: [
				// 		{
				// 			title: 'Incident Reporting',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'incident_reporting'
				// 		},
				// 		{
				// 			title: 'Incident Reporting Report',
				// 			root: true,
				// 			bullet: 'dot',
				// 		},
				// 	]
				// },
				/**
				 * Section Audit Management
				 */
				// {
				// 	title: 'Audit Management',
				// 	submenu: [
				// 		{
				// 			title: 'Audit Vendors',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'audit_vendors'
				// 		},
				// 		{
				// 			title: 'Audit Vendors Report',
				// 			root: true,
				// 		bullet: 'dot',
				// 		page: 'audit_vendors_info'
				// 		},
				// 		{
				// 			title: 'External Assessments',
				// 			root: true,
				// 			bullet: 'dot',
				// 			page: 'external_assessments'
				// 		},

				// 	]
				// },


			]
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
