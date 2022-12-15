const presets = [["@babel/preset-env", { targets: "defaults" }]];
const plugins = [];

if (process.env.NODE_ENV === "production") {
	plugins.push("transform-remove-console");
}

export default {
	presets,
	plugins,
};
