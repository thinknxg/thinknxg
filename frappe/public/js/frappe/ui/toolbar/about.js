frappe.provide("frappe.ui.misc");
frappe.ui.misc.about = function () {
	if (frappe.ui.misc.about_dialog) {
		frappe.ui.misc.about_dialog.show();
		return;
	}

	const dialog = new frappe.ui.Dialog({ title: __("thinkNXG Framework") });

	$(dialog.body).html(
		`<div>
				<p>${__("Open Source Applications for the Web")}</p>

				<p>
					<i class='fa fa-globe fa-fw'></i>
					${__("Website")}:
					<a href='https://thinknxg.com/' target='_blank'>https://thinknxg.com/</a>
				</p>

				<p>
					<i class='fa fa-github fa-fw'></i>
					${__("Source Code")}:
					<a href='https://github.com/thinknxg' target='_blank'>https://github.com/thinknxg</a>
				</p>

				<p>
					<i class='fa fa-file-text fa-fw'></i>
					${__("thinkNXG Blog")}:
					<a href='https://thinknxg.com/blog' target='_blank'>https://thinknxg.com/blog</a>
				</p>

				<p>
					<i class='fa fa-users fa-fw'></i>
					${__("thinkNXG Forum")}:
					<a href='https://discuss.thinknxg.com' target='_blank'>https://discuss.thinknxg.com</a>
				</p>


				<hr>

				<div class="d-flex align-items-center justify-content-between">
					<h4>${__("Installed Apps")}</h4>
					<button class="btn action-btn hidden" id="copy-apps-info"
					title="${__("Copy Apps Version")}"
					style="margin-bottom: var(--margin-md);">
						${frappe.utils.icon("clipboard")}
					</button>
				</div>

				<div id='about-app-versions'>${__("Loading versions...")}</div>
				<p>
					<b>
						<a href="/attribution" target="_blank" class="text-muted">
							${__("Dependencies & Licenses")}
						</a>
					</b>
				</p>

				<hr>

				<p class='text-muted'>${__("&copy; Kreatao Technologies and Contributors.")} </p>
			</div>`
	);

	frappe.ui.misc.about_dialog = dialog;

	frappe.ui.misc.about_dialog.on_page_show = function () {
		if (!frappe.versions) {
			frappe.call({
				method: "frappe.utils.change_log.get_versions",
				callback: function (r) {
					show_versions(r.message);
				},
			});
		} else {
			show_versions(frappe.versions);
		}
	};

	const get_version_text = function (app) {
		const is_pr_branch = app.branch && /^pr-\d+/i.test(app.branch);
		if (app.branch && !is_pr_branch) {
			return `${app.version} (${app.branch})`;
		}
		return app.version;
	};

	const render_app_icon = function (app_name, app) {
		const first_letter = (app.title || app_name).charAt(0).toUpperCase();
		if (app.logo) {
			return `<img src="${app.logo}" class="about-app-logo" alt="${first_letter}">`;
		}
		if (app.color) {
			return `<div class="about-app-icon" style="background-color: ${app.color};">${first_letter}</div>`;
		}
		const palette = frappe.get_palette(app_name);
		return `<div class="about-app-icon" style="background-color: var(${palette[0]}); color: var(${palette[1]});">${first_letter}</div>`;
	};

	const show_versions = function (versions) {
		if (versions.frappe) {
			$("#about-framework-version").text(`frappe: ${get_version_text(versions.frappe)}`);
		}

		// Show update button on Frappe Cloud sites when updates are available
		const $version_row = $("#about-framework-version").closest(".about-info-row");
		$version_row.find(".about-update-indicator").remove();
		if (frappe.boot.has_app_updates && frappe.boot.is_fc_site) {
			$(`<a href="https://frappecloud.com/dashboard/sites/${window.location.hostname}"
					target="_blank"
					class="btn btn-default btn-sm about-update-indicator">
					${__("Update Available")}
				</a>`).appendTo($version_row);
		}

		const $wrap = $("#about-app-versions").empty();

		for (const app_name in versions) {
			if (app_name === "frappe") continue;
			const app = versions[app_name];
			const version_text = get_version_text(app);
			const title = `${app_name}: ${app.version}`;

			$(`<div class="about-app-row" title="${title}">
					${render_app_icon(app_name, app)}
					<div class="about-app-info">
						<div class="about-app-name">${__(app.title)}</div>
						<div class="about-app-version">${app_name}: ${version_text}</div>
					</div>
				</div>`).appendTo($wrap);
		}

		frappe.versions = versions;
	};

	frappe.ui.misc.about_dialog.show();
};
