import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            服务条款
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            最后更新：2025年9月
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            这些条款规定了您对YaoTu平台和服务的使用。
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">条款接受</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    通过访问或使用YaoTu平台，您同意受这些服务条款的约束。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    如果您不同意这些条款，请不要使用我们的服务。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    我们保留随时修改这些条款的权利，修改后的条款将在平台上发布。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    继续使用服务即表示您接受修改后的条款。
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">用户责任</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    您必须提供准确、完整和最新的信息。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    您有责任维护账户信息的安全性和保密性。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    您必须年满18岁才能使用我们的服务。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    您同意遵守所有适用的法律法规。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    您不得将账户用于任何非法或未经授权的目的。
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Guide Obligations */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">导游义务</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游必须提供准确、专业的服务。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游有责任确保游客的安全和福祉。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游必须遵守所有当地法律法规。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游应保持专业和礼貌的态度。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游必须及时响应游客的询问和需求。
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">付款条款</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    所有付款均通过安全的支付系统处理。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    付款将在服务完成后进行。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    我们保留收取服务费的权利。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    退款政策将在具体服务页面详细说明。
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    价格可能因地区、季节和服务类型而异。
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-12">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <CardTitle className="text-xl text-red-900 dark:text-red-100">
                  禁止活动
                </CardTitle>
              </div>
              <CardDescription>
                以下活动在我们的平台上严格禁止：
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    发布虚假或误导性信息
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    骚扰、威胁或恐吓其他用户
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    从事任何非法活动
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    试图绕过平台进行直接交易
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    侵犯他人的知识产权
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    传播恶意软件或病毒
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    创建多个账户以规避限制
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    从事任何形式的歧视行为
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liability */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">责任限制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                YaoTu作为连接旅行者和导游的平台。我们促进介绍和付款，但不负责导游提供的实际服务。
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    导游是独立承包商，不是YaoTu的员工
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    用户参与活动需自担风险
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    我们建议所有旅行都购买适当的旅行保险
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Dispute Resolution */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">争议解决</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                我们鼓励用户友好地解决争议。如果出现问题：
              </p>
              <ol className="space-y-2">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">1</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    直接联系对方尝试解决问题
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">2</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    联系YaoTu支持团队寻求调解协助
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">3</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    如有必要，进行正式的争议解决程序
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="text-center">
          <Card>
            <CardHeader>
              <CardTitle>对这些条款有疑问？</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                如果您对这些服务条款有疑问，请联系我们的法律团队。
              </p>
              <Link href="/">
                <Button>
                  联系我们
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
