import TermsOfServiceController from './TermsOfServiceController'
import PrivacyPolicyController from './PrivacyPolicyController'
import PublicViewController from './PublicViewController'
import UserProfileController from './UserProfileController'
import OtherBrowserSessionsController from './OtherBrowserSessionsController'
import CurrentUserController from './CurrentUserController'
import TeamController from './TeamController'
import CurrentTeamController from './CurrentTeamController'
import TeamInvitationController from './TeamInvitationController'
import OrganizationSetupController from './OrganizationSetupController'
import DashboardController from './DashboardController'
import OrganizationController from './OrganizationController'
import CustomerController from './CustomerController'
import InvoiceController from './InvoiceController'
import NumberingSeriesController from './NumberingSeriesController'
import SettingsController from './SettingsController'
import EmailTemplateController from './EmailTemplateController'

const Controllers = {
    TermsOfServiceController: Object.assign(TermsOfServiceController, TermsOfServiceController),
    PrivacyPolicyController: Object.assign(PrivacyPolicyController, PrivacyPolicyController),
    PublicViewController: Object.assign(PublicViewController, PublicViewController),
    UserProfileController: Object.assign(UserProfileController, UserProfileController),
    OtherBrowserSessionsController: Object.assign(OtherBrowserSessionsController, OtherBrowserSessionsController),
    CurrentUserController: Object.assign(CurrentUserController, CurrentUserController),
    TeamController: Object.assign(TeamController, TeamController),
    CurrentTeamController: Object.assign(CurrentTeamController, CurrentTeamController),
    TeamInvitationController: Object.assign(TeamInvitationController, TeamInvitationController),
    OrganizationSetupController: Object.assign(OrganizationSetupController, OrganizationSetupController),
    DashboardController: Object.assign(DashboardController, DashboardController),
    OrganizationController: Object.assign(OrganizationController, OrganizationController),
    CustomerController: Object.assign(CustomerController, CustomerController),
    InvoiceController: Object.assign(InvoiceController, InvoiceController),
    NumberingSeriesController: Object.assign(NumberingSeriesController, NumberingSeriesController),
    SettingsController: Object.assign(SettingsController, SettingsController),
    EmailTemplateController: Object.assign(EmailTemplateController, EmailTemplateController),
}

export default Controllers