import gulp from "gulp";
import fileInclude from "gulp-file-include";
import htmlmin from "gulp-htmlmin";
import { deleteAsync } from "del";
import browserSync from "browser-sync";
import replace from "gulp-replace";
import versionNumber from "gulp-version-number";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import webpack from "webpack-stream";
import gulpIf from "gulp-if";
import webpackConfig from "./webpack.config.js";

const sass = gulpSass(dartSass);

// paths

const prod = "prod"; // production folder
const source = "src"; // source folder

// const isProd = process.argv.includes("--production");
const isProd = process.env.NODE_ENV === "production";

const path = {
	prod: {
		html: prod + "/",
		js: prod + "/js/",
		css: prod + "/css/",
		images: prod + "/images/",
		data: prod + "/data/",
		fonts: prod + "/fonts/",
	},

	source: {
		html: [
			source + "/pages/*.html",
			"!" + source + "/pages/common/**/*.html",
			"!" + source + "/pages/includes/**/*.html",
		],
		js: source + "/js/main.js",
		scss: source + "/scss/main.scss",
		images: source + "/static/images/*.*",
		data: source + "/static/data/*.json",
		fonts: source + "/fonts/**/*.*",
	},

	watch: {
		html: source + "/pages/**/*.html",
		js: source + "/js/**/*.js",
		scss: source + "/scss/*.scss",
	},

	clean: {
		del: "./" + prod,
	},
};

// config web server

const configServer = {
	server: {
		baseDir: "./" + prod,
	},
	port: 9000,
	notify: false,
};

// html

const html = () => {
	return gulp
		.src(path.source.html)
		.pipe(fileInclude())
		.pipe(replace(/@img\//g, "img/"))
		.pipe(
			gulpIf(
				isProd,
				versionNumber({
					value: "%DT%",
					append: {
						key: "_v",
						cover: 0,
						to: ["css", "js"],
					},
					output: {
						file: "version.json",
					},
				})
			)
		)
		.pipe(
			gulpIf(
				isProd,
				htmlmin({
					collapseWhitespace: true,
				})
			)
		)
		.pipe(gulp.dest(path.prod.html))
		.pipe(browserSync.stream());
};

// sass

const scss = () => {
	return gulp
		.src(path.source.scss, { sourcemaps: !isProd })
		.pipe(
			sass({
				outputStyle: "expanded",
			})
		)
		.on("error", sass.logError)
		.pipe(
			gulpIf(
				isProd,
				autoprefixer({
					cascade: false,
					grid: true,
					overrideBrowserslist: ["last 5 versions"],
				})
			)
		)
		.pipe(gulpIf(isProd, cleanCSS()))
		.pipe(
			rename((path) => {
				if (!path.extname.endsWith(".map")) {
					path.basename += ".min";
				}
			})
		)
		.pipe(gulp.dest(path.prod.css, { sourcemaps: "." }))
		.pipe(browserSync.stream());
};

// js

const js = () => {
	return gulp
		.src(path.source.js)
		.pipe(webpack(webpackConfig(isProd)))
		.pipe(gulp.dest(path.prod.js))
		.pipe(browserSync.stream());
};

// static files

const copyImages = () => {
	return gulp.src(path.source.images).pipe(gulp.dest(path.prod.images));
};

const copyData = () => {
	return gulp.src(path.source.data).pipe(gulp.dest(path.prod.data));
};

// fonts

const fonts = () => {
	return gulp.src(path.source.fonts).pipe(gulp.dest(path.prod.fonts));
};

//clean

const clean = () => {
	return deleteAsync(prod, { force: true });
};

// watch files

const watchFiles = () => {
	gulp.watch([path.watch.scss], scss);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.html], html);
};

// server
const webServer = () => {
	browserSync.init(configServer);
};

// add scripts package.json

export const start = gulp.series(
	clean,
	html,
	scss,
	js,
	fonts,
	copyData,
	copyImages,
	gulp.parallel(watchFiles, webServer)
);
export const build = gulp.series(
	clean,
	html,
	scss,
	js,
	fonts,
	copyData,
	copyImages
);
export { isProd, copyData, copyImages, clean };
