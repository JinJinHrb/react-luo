/** 这是用于开发环境的webpack配置文件 **/

const path = require("path"); // 获取绝对路径用
const webpack = require("webpack"); // webpack核心
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 动态生成html插件
const HappyPack = require("happypack"); // 多线程编译
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const webpackbar = require("webpackbar");
const PUBLIC_PATH = "/"; // 基础路径
module.exports = {
  mode: "development",
  entry: [
    "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", // webpack热更新插件，就这么写
    "./src/index.tsx", // 项目入口
  ],
  output: {
    path: __dirname + "/", // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
    filename: "bundle.js", // 编译后的文件名字
  },
  devtool: "eval-source-map", // 报错的时候在控制台输出哪一行报错
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        test: /\.js?$/,
        enforce: "pre",
        use: ["source-map-loader", "eslint-loader"],
        include: path.resolve(__dirname, "src"),
      },
      {
        // .tsx 解析
        test: /\.tsx?$/,
        use: ["awesome-typescript-loader"],
        include: path.resolve(__dirname, "src"),
      },
      {
        // .js .jsx用babel解析
        test: /\.js?$/,
        use: ["happypack/loader"],
        include: path.resolve(__dirname, "src"),
      },
      {
        // .css 解析
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: ["style-loader", "css-loader", "postcss-loader", { loader: "less-loader", options: { javascriptEnabled: true } }],
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "file-loader",
            options: {
              name: "assets/[name].[hash:4].[ext]",
            },
          },
        ],
      },
      {
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "assets/[name].[hash:4].[ext]",
            },
          },
        ],
      },
      {
        // wasm文件解析
        test: /\.wasm$/,
        include: path.resolve(__dirname, "src"),
        type: "webassembly/experimental",
      },
      {
        // xml文件解析
        test: /\.xml$/,
        include: path.resolve(__dirname, "src"),
        use: ["xml-loader"],
      },
    ],
  },
  plugins: [
    new webpackbar(),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        PUBLIC_URL: PUBLIC_PATH,
      }),
    }),
    new HappyPack({
      loaders: ["babel-loader"],
    }),
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      filename: "index.html", //生成的html存放路径，相对于 output.path
      favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
      template: "./public/index.ejs", //html模板路径
      inject: true, // 是否将js放在body的末尾
      templateParameters: {
        manifest: "",
      },
    }),
    // 自动生成各种类型的favicon，这么做是为了以后各种设备上的扩展功能，比如PWA桌面图标
    new FaviconsWebpackPlugin({
      logo: "./public/favicon.png",
      prefix: "icons/",
      icons: {
        android: false,
        firefox: false,
        appleStartup: false,
      },
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".less", ".css", ".wasm"], //后缀名自动补全
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
