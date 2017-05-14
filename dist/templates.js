angular.module('app').run(['$templateCache', function($templateCache) {$templateCache.put('/modules/dashboard.html','<div  >\n    dashboard\n</div>');
$templateCache.put('/modules/homeContainer.html','<div class="" ng-controller="homeController" cg-busy="promices.initPromice">\n\t<div class=" view-animate-container">\n        <div  ui-view class="ng-enter" class="view-animate" layout="column" flex >\n\n        </div>\n    </div>\n</div>\n');
$templateCache.put('/modules/account/accountContainer.html','\n<div  ui-view  class="div-center">\n    \n</div>');
$templateCache.put('/modules/account/forgotpassword.html','\n<div  ng-controller="accountController"   >\n    <div class="bg-orange" layout="row " layout-align="center center" style="height:100vh;" layout-wrap  >\n          \n          <md-card style="" flex-sm="70" flex-md="50" flex-gt-md="30" >\n            <img ng-src="./images/bg-5.jpg" class="md-card-image" style="height:150px" alt="">\n            <md-card-title>\n                <md-card-title-text>\n                    <span class="md-headline">Trouble signing in?</span>\n                </md-card-title-text>\n            </md-card-title>\n            <md-card-content>\n                <md-input-container class="md-icon-float md-block">\n                    <label>\n                        <ng-md-icon icon="account_circle"></ng-md-icon>\n                        Email id\n                    </label>\n                    <input ng-model="loginModel.userName" type="text">\n                </md-input-container>\n            </md-card-content>\n            <md-card-actions layout="column" layout-align="start">\n                <md-button class="md-raised md-primary">Ok</md-button>\n                \n                <md-button ui-sref="account.login" >Cancel</md-button>\n            </md-card-actions>\n        </md-card>        \n\n  </div>\n \n</div>');
$templateCache.put('/modules/account/login.html','\n<div class="vertical-center col-lg-6 col-md-10 col-sm-10" ng-controller="accountController"   >\n    <div class="div-center">\n            \n        <form name="signin" >\n            <cp-logo size="75"></cp-logo>\n            <div class="input-group input-group-lg">\n                <span class="input-group-addon" id="sizing-addon1">\n                    <span class="glyphicon glyphicon-user"></span>\n                </span>\n                <input type="text" ng-model="loginModel.userName" class="form-control" placeholder="Username" aria-describedby="sizing-addon1">\n            </div>\n            \n            <div class="input-group input-group-lg">\n                <span class="input-group-addon" id="sizing-addon1"><span class="glyphicon glyphicon-asterisk"></span></span>\n                <input type="text" ng-model="loginModel.password" class="form-control" placeholder="Password" aria-describedby="sizing-addon1">\n            </div>\n            <button type="button" class="btn btn-success" ng-click="signIn()">Ok</button>\n            <p/>\n            <a  ui-sref="account.forgotpassword">Forgot password? Click to reset.</a> \n            <p/>\n            <a ui-sref="account.register" >Signup</a>\n        </form>\n\n    </div>\n</div>');
$templateCache.put('/modules/account/register.html','<div class="vertical-center col-lg-6 col-md-10 col-sm-10" ng-controller="registerController">\n\t<div class="div-center">\n\t\t<!--<img src="./images/cp.png"></img>-->\n\t\t<cp-logo size="75"></cp-logo>\n\t\t<h4>Sign up!</h4>\n\t\t<form name="register">\n\t\t\t<div class="form-group">\n\t\t\t\t\t<label>First name</label>\n\t\t\t\t\t<input type="text" class="form-control" ng-model="registerModel.fn"  />\n\t\t\t</div>\n\t\t\t<div class="form-group">\n\t\t\t\t\t<label>Last name</label>\n\t\t\t\t\t<input type="text" class="form-control" ng-model="registerModel.ln"  />\n\t\t\t</div>\n\t\t\t<div class="form-group">\n\t\t\t\t\t<label>Mobile number</label>\n\t\t\t\t\t<input type="text" class="form-control" ng-model="registerModel.mobileNo"  />\n\t\t\t</div>\n\t\t\t<div class="form-group">       \n\t\t\t\t\t<button type="button" class="btn btn-success" ng-click="saveRegistration()">Join</button>\n\t\t\t</div>\n\t\t\t<div class="form-group">\n\t\t\t\t\t<a type="button" style="btn btn-warning"> Already registered?</a>\n\t\t\t</div>\n\t\t</form>  \n\t</div>\n</div>');
$templateCache.put('/modules/account/registration.success.html','\n<div class="vertical-center col-lg-6 col-md-10 col-sm-10" ng-controller="registrationSuccessController">\n\t<div class="div-center">\n\t\t<div class="form-group">\n\t\t\t<h4>Registration success!</h4>\n\t\t\t<h6>You will shortly recieve the pin code which you can use for login.</h6>\n\t\t</div>\n\t\t<button ui-sref="account.login" type="button" class="btn btn-success"> Ok</button>\n\t</div>\n</div>');
$templateCache.put('/modules/assets/asset.edit.html','        \n<div layout="column" ng-cloak ng-controller="assetEditController" cg-busy="promises.loading" >\n    <md-toolbar class=""  >   \n        <div class="md-toolbar-tools">\n            <md-button class="md-icon-button" aria-label="back" ng-click="historyBack()"> \n                <i class="material-icons">arrow_back</i>\n            </md-button>   \n            <span>{{title}}</span>\n            <span flex></span>\n            <!--<md-button class="md-icon-button" aria-label="Menu" ng-click="newTopic()">\n\t\t\t\t<i class="material-icons">add</i>\n\t\t\t</md-button>-->\n        </div>\n    </md-toolbar>\n    <md-content layout="row">\n        <div aria-label="asset" layout="column" layout-padding flex layout-align="center" >\n            <div layout="row" flex layout-align="center center">\n                <ez-image-upload img="asset.thumbnail" ></ez-image-upload>\n                <div layout="column" flex>\n                    <div layout-gt-sm="row">\n                        <md-input-container class="md-block" flex-gt-sm>\n                            <label>Name</label>\n                            <input ng-model="asset.name">\n                        </md-input-container>\n                        <div class="hint" ></div>\n                    </div>\n                    <span>\n                        <time ng-show="asset.updatedOn">\n                            <span>Last Updated : {{  asset.updatedOn | amCalendar }}</span>\n                        </time>\n                    </span>\n                </div>\n            </div>\n            <div>\n                <form >\n                    <div layout="column" >\n                        <!--<md-input-container\n                            <md-select ng-model="asset.AssetType" ng-model-options="{trackBy: \'$value.Name\'}">\n                                <md-option ng-value="c" ng-repeat="c in types">{{c.DisplayName}}</md-option>\n                            </md-select>\n                        </md-input-container>-->\n                        <md-input-container class="md-block">\n                            <label>Description</label>\n                            <textarea ng-model="asset.description" columns="1" md-maxlength="2000" rows="5"></textarea>\n                        </md-input-container>\n\n                        <div ez-expando expando-title="Files">\n                            <div layout="row" layout-align="center center">\n                                \n                                <!--<div class="orangered"\n                                    ngf-drop="" ng-model="asset.file" ngf-drag-over-class="\'dragover\'" ngf-multiple="false"\n                                    ngf-allow-dir="false" ngf-pattern="\'.png,.jpg,.gif,.jpeg,.mov,.pdf,.mp4,.mp3\'">                   \n                                </div>\n                                -->\n                                <md-button class="md-raised  md-primary md-icon-button" \n                                    ngf-select ng-model="asset.file">\n                                    <i class="material-icons">file_upload</i>\n                                </md-button>\n                                <md-button ng-if="asset.Urls!=null && asset.Urls.length > 0" class="md-raised  md-primary md-icon-button">\n                                    <i class="material-icons">remove_red_eye</i>\n                                </md-button>\n                            </div>\n                            <span>{{file.name}}</span>\n                        </div>\n                        \n                        <div ez-expando expando-title="File Expiry">\n                            <md-switch ng-model="asset.neverExpire" aria-label="Switch 1" flex="30">\n                                    <span ng-if="asset.neverExpire"> Never Expire</span>\n                                    <span ng-if="!asset.neverExpire"> Expire On</span>\n                            </md-switch>\n                            <span><h4>Expiry</h4></span>\n\n                            <div layout="row" layout-align="left center">\n                                <md-datepicker class="transperent-bg" name="activateOn" ng-model="asset.activateOn" md-placeholder="Activate on" flex="50" ></md-datepicker>\n                                <flex>\n                                <md-datepicker ng-if="!asset.neverExpire" class="transperent-bg"  name="expireOn" ng-model="asset.expireOn" md-placeholder="Expire on" flex="50"></md-datepicker>\n                            </div>\n                            <div layout="row" layout-align="left center">                \n                                <md-switch ng-model="asset.allowComment" aria-label="Switch 1" flex>\n                                    Allow Comments\n                                </md-switch>\n                                <md-switch ng-model="asset.allowLike" aria-label="Switch 1" flex>\n                                    Allow Likes\n                                </md-switch>\n                            </div>\n                        </div>\n                    \n                        \n                        \n                        <div ez-expando expando-title="Accessible to Members : {{asset.accessibility.length || \'All\'}}">\n                            <div  class=" md-card chipsContactChips">\n                                <md-content class="md-padding autocomplete" layout="column">\n                                    <md-contact-chips\n                                        ng-model="tempData.accessibility"\n                                        md-contacts="querySearch($query)"\n                                        md-contact-name="_name"\n                                        md-contact-image="Picture"\n                                        md-contact-email="userName"\n                                        placeholder="Add members"\n                                        filter-selected="true"\n                                        md-separator-keys="separatorKeys">\n                                    </md-contact-chips>\n                                </md-content>\n                            </div>\n                        </div>\n                \n                        <md-divider></md-divider>\n                        <div ng-switch="asset.assetTypeId">\n                            <div ng-switch-when="type_collection">\n                                <h2>Collection</h2>    \n                            </div>\n                            <div ng-switch-when="type_event">\n                                <h2>Event</h2>    \n                            </div>\n                            <div ng-switch-when="type_task">\n                                <h2>Task</h2>    \n                                <div ez-expando expando-title="Assigned to : {{asset.task.owners.length || \'Not set\'}}">\n                                    <div  class=" md-card chipsContactChips">\n                                        <md-content class="md-padding autocomplete" layout="column">\n                                            <md-contact-chips\n                                                ng-model="tempData.owners"\n                                                md-contacts="querySearch($query)"\n                                                md-contact-name="_name"\n                                                md-contact-image="picture"\n                                                md-contact-email="userName"\n                                                placeholder="Add Assignee"\n                                                filter-selected="true"\n                                                md-separator-keys="separatorKeys">\n                                            </md-contact-chips>\n                                        </md-content>\n                                    </div>\n                                </div>\n                                <div>\n                                    <md-input-container class="md-block" flex-gt-sm flex="35">\n                                        <label>Status</label>\n                                        <md-select ng-model="asset.task.taskStatus">\n                                            <md-option ng-repeat="s in taskStatuses">\n                                                {{s}}\n                                            </md-option>\n                                        </md-select>\n                                    </md-input-container>\n                                    <div layout="column"  >\n                                        <h3>Updates</h3>\n                                        <div ng-repeat="u in asset.Task.Updates track by $index">\n                                            <span>{{u.Update}}</span>\n                                            <span ng-show=" u.updatedBy != null">{{" updated by :" + u.updatedBy }}</span>\n                                            <span ng-show=" u.updatedOn != null"> On : {{  u.updatedOn | amCalendar }}</span>\n                                            <md-button class="md-raised  md-primary md-icon-button" ng-click="editUpdate(u)"> \n                                                <i class="material-icons">add</i>\n                                            </md-button>  \n                                        </div>\n                                        <div ng-show="asset.task.updates == null || asset.task.updates.length <= 0">\n                                            <span>No updates available</span>\n                                        </div>\n                                    </div>\n                                    <div layout="row">\n                                        <md-input-container class=""  flex="75">\n                                            <label>Enter update</label>\n                                            <textarea ng-model="tempData.taskUpdate" md-maxlength="2000" rows="3"  ></textarea>\n                                        </md-input-container>\n                                            \n                                        <md-button class="md-raised  md-primary md-icon-button" ng-click="addUpdate()"> \n                                            <i class="material-icons">add</i>\n                                        </md-button>  \n                                        <pre>{{tempData.taskUpdate}}</pre>\n                                    </div>\n                                </div>\n                                \n                            </div>\n                            <div ng-switch-when="type_demand">\n                                <h2>demand</h2>    \n                            </div>\n                            <div ng-switch-when="type_transaction">\n                                <h2>transaction</h2>    \n                            </div>\n                            <div ng-switch-when="type_questionnaire">\n                                <h2>Form</h2>    \n                            </div>\n                        </div>\n                    </div>\n                </form>\n            </div>\n            <div layout="row" layout-align="end center">\n                <ez-json-viewer jsonobj="asset"></ez-json-viewer>\n                <md-button ng-click="saveAsset()" >Save</md-button>\n                <md-button ng-click="cancel()">Cancel</md-button>\n            </div>\n        </div>\n    </md-content>\n    <!-- comment dialog template-->\n    <script type="ng-template">\n    </script>\n    <!-- </md-bottom-sheet> -->\n</div>\n');
$templateCache.put('/modules/assets/asset.list.html','<div cg-busy="promices.assetList" ng-controller="assetLstController" cg-busy="promices.groupDetail" >\n  \n    <!--<md-button class="md-fab md-fab-top-right" aria-label="Add" ng-click="createAsset()">\n        <ng-md-icon icon="add"></ng-md-icon>\n    </md-button>-->\n    <div layout ="row">\n        <ez-thumb img="group.Thumbnail" text="group.Name"></ez-thumb>\n        <span>{{group.Name}}</span>\n        <div>\n            <span ng-repeat="b in nodeParentTrail">    \n                <span ng-if="$index > 0"><</span>\n                <md-button ng-click="onAssetSelected(b)" class="md-accent">{{b.Name}}</md-button>\n            </span>\n        </div>\n        <div flex></div>\n      </div>\n    <div layout-padding layout="row">\n        \n        <div layout="column" flex="30">\n            <md-menu>\n                <md-button class="md-raised md-accent" ng-click="$mdOpenMenu($event)">Create...</md-button>\n                <md-menu-content>\n                            \n                            \n                    <md-button ng-click="edit(null,\'type_collection\', $event)">\n                        <div layout="row" layout-align="left center">\n                            <i class="material-icons">collections_bookmark</i>\n                            Topic\n                        </div>\n                    </md-button>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_document\',$event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">message</i>\n                                    Message/Document\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_task\', $event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">notifications_active</i>\n                                    Work Item\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_form\' ,$event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">assignment</i>\n                                    Form\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_calendar\', $event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">event</i>\n                                    Calendar Event\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_demand\', $event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">assignment_turned_in</i>\n                                    Deamad/Requst\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                    <md-menu-item>\n                        <md-button ng-click="edit(null, \'type_transaction\', $event)">\n                            <div layout="row" layout-align="left center">\n                                <i class="material-icons">attach_money</i>\n                                    Transaction\n                            </div>\n                        </md-button>\n                    </md-menu-item>\n                            \n                </md-menu-content>\n            </md-menu>    \n            <div ez-tree selected-nodes="selectedNode" \n                parent-trail="nodeParentTrail" options="hierarchyTreeOptions"\n                allow-multi-select="false" tree="hierarchy" on-select="onAssetSelected">\n                tree div\n            </div>\n            <!--<ezTree tree="menu" options="options" selected-nodes="selectedMenu"\n                    on-select="onMenuSelect(n)"></ezTree>-->\n        </div>\n        <div layout="column" flex="70">\n            <div class="table">\n                <div class="table-row" layout="row" >\n                    <div class="table-cell" flex="5">\n                        <md-checkbox aria-label="Select All"\n                                        ng-model="isAllChecked"\n                                        ng-change="selectAllChecked()"\n                                        md-indeterminate>\n                        </md-checkbox>\n                    </div>\n                    <div class="table-cell" flex="5">\n                        <!--thumb-->\n                    </div>\n                    <div class="table-cell" flex="50"><h4>Name</h4></div>\n                    <div class="table-cell" flex="15"><h4>Created By</h4></div>\n                    <div class="table-cell" flex="10"><h4>Updated On</h4></div>\n                    <div class="table-cell" flex="15"><h4>Actions</h4></div>\n                </div>\n            </div>\n\n            <md-content class="transperent-bg" flex layout layout-align="center" style="height:60vh;">\n                <div layout="column" class="table">\n                    <div ng-dblclick="onRowSelected(asset)" class="table-row hover-on-select" layout="row" ng-repeat="asset in assets"  >\n                        <div class="table-cell" flex="5">\n                            <md-checkbox aria-label="Select" ng-checked="asset.__isSelected" ng-click="toggle(asset)">\n                            </md-checkbox>\n                            <span>{{$index + 1}}</span>\n\n                        </div>\n                        <div class="table-cell" flex="5" layout="row" >\n                            <!--<ez-thumb img="asset.Thumbnail" text="asset.Name"></ez-thumb>-->\n                            <span ng-click="onRowSelected(asset)" class="material-icons-lg" data-ng-class="asset.AssetTypeId"></span>\n                        </div>\n\n                        <div  class="table-cell" flex="50" layout="column" >\n                            <span>\n                            {{asset.Name}}</span>\n                        </div>\n                        <div class="table-cell" flex="15">{{asset.CreatedBy.Name}}</div>\n                        <div class="table-cell" flex="10">\n                            <time title="{{ asset.UpdatedOn | amDateFormat: \'dddd, Do MMM YYYY, h:mm a\' }}">\n                                <span>{{ asset.UpdatedOn | amCalendar }}</span>\n                            </time>\n                        </div>\n                        <div class="table-cell" flex="15">\n                            <md-button class="md-icon-button" aria-label="view" ng-click="view(asset)">\n                                    <i class="material-icons">view</i>\n                            </md-button>\n                            <md-button class="md-icon-button" aria-label="edit" ng-click="edit(asset)">\n                                    <i class="material-icons">edit</i>\n                            </md-button>\n                        </div>\n                    </div>\n                </div>\n            </md-content>\n        </div>\n    </div>            \n</div>');
$templateCache.put('/modules/assets/file.list.html','<div cg-busy="promices.fileList" ng-controller="fileLstController" cg-busy="promices.tree" >\n\n    <div layout-padding layout="row">\n        <div>\n            <div ez-tree selected-nodes="selectedNode" \n                parent-trail="nodeParentTrail" options="hierarchyTreeOptions"\n                allow-multi-select="false" tree="hierarchy" on-select="onAssetSelected">\n                tree div\n            </div>\n            <!--<ezTree tree="menu" options="options" selected-nodes="selectedMenu"\n                    on-select="onMenuSelect(n)"></ezTree>-->\n        </div>    \n        <div layout="column" flex="70">\n            <div class="table">\n                <div class="table-row" layout="row" >\n                    <div class="table-cell" flex="5">\n                        \n                    </div>\n                    <div class="table-cell" flex="50"><h4>Name</h4></div>\n                    <div class="table-cell" flex="15"><h4>Created By</h4></div>\n                    <div class="table-cell" flex="15"><h4>Actions</h4></div>\n                </div>\n            </div>\n\n            <md-content class="transperent-bg" flex layout="row" layout-align="center" style="height:60vh;">\n                \n                <div layout="column" class="table">\n                    <div ng-dblclick="onAssetSelected(file)" class="table-row hover-on-select" layout="row" ng-repeat="file in selectedNode.children"  >\n                        <div class="table-cell" flex="5">\n                            <span>{{$index + 1}}</span>\n                            <span ng-click="onAssetSelected(file)" class="material-icons-lg" data-ng-class="file.fileTypeId"></span>\n                        </div>\n                    \n                        <div  class="table-cell" flex="50" layout="column" >\n                            <span>\n                            {{file.name}}</span>\n                        </div>\n                        <div class="table-cell" flex="15"></div>\n                        <div class="table-cell" flex="15">\n                            <md-button class="md-icon-button" aria-label="view" ng-click="view(file)">\n                                    <i class="material-icons">view</i>\n                            </md-button>\n                        </div>\n                    </div>\n                </div>\n            </md-content>\n        </div>\n    </div>            \n</div>');
$templateCache.put('/modules/assets/form.edit.html','<md-bottom-sheet class="height-100">\n<!--<md-dialog aria-label="Edit Asset"  flex="80" >-->\n    <md-toolbar>\n        <div class="md-toolbar-tools">\n            <h2></h2>\n            <span flex></span>\n            <md-switch ng-model="asset.Publish" aria-label="Publish now" flex>\n                Publish now\n            </md-switch>\n            <md-button class="md-icon-button" ng-click="cancel()">\n                <i class="material-icons">close</i>\n            </md-button>\n        </div>\n    </md-toolbar>\n    <md-container>\n        <form >\n            <div layout="column">\n                <div layout="row" flex>\n                    <div layout="column" flex="33" layout-padding>\n                        <md-input-container>\n                            <md-select ng-model="asset.AssetCategory" ng-model-options="{trackBy: \'$value.Name\'}">\n                                <md-option ng-value="c" ng-repeat="c in categories">{{c.DisplayName}}</md-option>\n                            </md-select>\n                        </md-input-container>\n                        <div layout="row" layout-align="center center">\n                            <md-button class="md-raised  md-primary md-icon-button" ngf-select ng-model="file" ngf-pattern="\'.png,.jpg,.gif,.jpeg,.mov,.pdf,.mp4,.mp3\'">\n                                <i class="material-icons">file_upload</i>\n                            </md-button>\n                            <md-button ng-if="asset.Urls!=null && asset.Urls.length > 0" class="md-raised  md-primary md-icon-button">\n                                <i class="material-icons">remove_red_eye</i>\n                            </md-button>\n                        </div>\n                        <span>{{file.name||asset.Urls[0]}}</span>\n                        <ez-image-upload img="asset.Thumbnail" thumbnail-class="\'square\'"></ez-image-upload>\n                        \n                        \n                        \n                    </div>\n                    <div layout="column" flex layout-padding>\n                        <!--category-->    \n                                    \n                        <md-input-container class="md-block" flex>\n                            <label>Title</label>\n                            <input ng-model="asset.Name">\n                        </md-input-container>\n                        <md-input-container class="">\n                            <label>Description</label>\n                            <textarea ng-model="asset.Description" md-maxlength="2000" rows="3" ></textarea>\n                        </md-input-container>\n                    \n                        <div >\n                            <span flex="20" class="">Expiry</span>\n                            <div layout="row" layout-align="left center">\n                                \n                                <md-datepicker class="transperent-bg" name="activateOn" ng-model="asset.ActivateOn" md-placeholder="Activate on" flex="40" ></md-datepicker>\n                                <md-switch ng-model="asset.neverExpire" aria-label="Switch 1" flex="20">\n                                    <span ng-if="asset.neverExpire"> Never Expire</span>\n                                    <span ng-if="!asset.neverExpire"> Expire On</span>\n                                </md-switch>\n                                <md-datepicker ng-if="!asset.neverExpire" class="transperent-bg"  name="expireOn" ng-model="asset.ExireOn" md-placeholder="Expire on" flex="40"></md-datepicker>\n                            </div>\n                        </div>\n                        <div layout="row" layout-align="left center">                \n                            <md-switch ng-model="asset.AllowComment" aria-label="Switch 1" flex>\n                                Allow Comments\n                            </md-switch>\n                            <md-switch ng-model="asset.AllowLike" aria-label="Switch 1" flex>\n                                Allow Likes\n                            </md-switch>\n                        </div>\n                    </div>\n                </div>\n                <md-divider></md-divider>\n                <pre>{{asset.AssetCategory.Name}}</pre>\n                <div ng-switch="asset.AssetCategory.Name">\n                    <div ng-switch-when="ct_event">\n                        <h2>Event</h2>    \n                    </div>\n                    <div ng-switch-when="ct_task">\n                        <h2>Task</h2>    \n                    </div>\n                    <div ng-switch-when="ct_demand">\n                        <h2>demand</h2>    \n                    </div>\n                    <div ng-switch-when="ct_transaction">\n                        <h2>transaction</h2>    \n                    </div>\n                    <div ng-switch-when="ct_questionnaire">\n                        <h2>Form</h2>    \n                    </div>\n                </div>\n            </div>\n            <div layout="row">\n                <span flex></span>\n                <md-button ng-click="saveAsset()" >\n                    Save\n                </md-button>\n                <md-button ng-click="cancel()">\n                    Cancel\n                </md-button>\n            </div>  \n        </form>\n    <md-container>\n<!--</md-dialog>-->\n</md-bottom-sheet>');
$templateCache.put('/modules/groups/group.analytics.html','<div cg-busy="promices.analytics" >\n      <md-toolbar class=""  >\n\t\t  <div class="md-toolbar-tools">\n            <ez-thumb img="group.Thumbnail" text="group.Name"></ez-thumb>\n            <span>{{group.Name}}</span>\n            <div flex></div>\n            <md-button class="md-icon-button" aria-label="save" ui-sref="home.group.detail">\n\t\t\t\t<i class="material-icons">info</i>\n            </md-button>\n            <md-button class="md-icon-button" aria-label="save" ui-sref="home.group.assets">\n\t\t\t\t<i class="material-icons">view_list</i>\n            </md-button>\n            <md-button class="md-icon-button" aria-label="save" ui-sref="home.group.analytics">\n            \t<i class="material-icons">assessment</i>\n            </md-button>\n            \n            <div flex></div>\n            \n\t\t  </div>\n    </md-toolbar>\n      \n</div>');
$templateCache.put('/modules/groups/group.board.html','<div  ng-controller="groupBoardController"  cg-busy="promices.groupTopics" >\n\t<nav class="navbar navbar-inverse navbar-fixed-top fixed-top sticky-top bg-primary">\n\t\t<span class="navbar-brand" href=""><a ng-click="historyBack()"><span class="glyphicon glyphicon-arrow-left"></span></a> {{title}}</span>\n\t\t<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"\n\t\t aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\n\t\t\t<span class="navbar-toggler-icon"></span>\n\t\t</button>\n\t</nav>\n\t<div class="" role="main">\n\t\t<ul class="list-group" >\n\t\t\t<li>Topics {{topics.length}}</li>\n\t\t\t<li ng-repeat="i in topics" ng-click="openTopic(item)" class="list-group-item list-group-item-action flex-column align-items-start">\n\t\t\t\t<div class="row">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<img ng-src="{{item.thumbnail || defaultGroupThumbnail}}" class="thumbnail sq sq-sm" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<div class="">\n\t\t\t\t\t\t\t<h7 class="mb-1">{{item.name}}</h7>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p class="mb-1">{{item.description}} </p>\n\t\t\t\t\t\t<small class="text-muted">3 days ago</small>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t<li class="list-group-item list-group-item-action flex-column align-items-start">\n\t\t\t\t<div class="div-center"><a ng-click="createGroup()">New Topic</a></div>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>');
$templateCache.put('/modules/groups/group.detail.html','<div  ng-controller="groupDetailController"  cg-busy="promices.busy" >\n    <md-toolbar class=""  >   \n        <div class="md-toolbar-tools">\n            <md-button class="md-icon-button" aria-label="back" ng-click="historyBack()"> \n                <i class="material-icons">arrow_back</i>\n            </md-button>   \n            <span>{{title}}</span>\n        </div>\n    </md-toolbar>\n    <md-content layout-padding layout="column">\n        <div layout="row" flex  layout-align="start start">\n            <ez-image-upload img="group.thumbnail" ></ez-image-upload>\n            <div layout="column" flex>\n                <div layout-gt-sm="row">\n                    <md-input-container class="md-block" flex-gt-sm>\n                        <label>What\'s the group called!</label>\n                        <input ng-model="group.name">\n                    </md-input-container>\n                    <div class="hint" ></div>\n                </div>\n                <md-input-container class="md-block">\n                    <label>More about this awesome group</label>\n                    <textarea ng-model="group.description" columns="1" md-maxlength="150" rows="5"></textarea>\n                </md-input-container>\n            </div>\n        </div>\n        <div class="chipsContactChips">\n            <md-sub-header>Group Members : {{group.members.length || \'0\'}}</md-sub-header>\n            <md-content class="md-padding autocomplete" layout="column">\n                \n                <md-contact-chips\n                    ng-model="group.members"\n                    md-contacts="querySearch($query)"\n                    md-contact-name="_name"\n                    md-contact-image="picture"\n                    md-contact-email="userName"\n                    md-require-match="true"\n                    md-highlight-flags="i"\n                    filter-selected="true"\n                    md-separator-keys="separatorKeys"\n                    placeholder="+Member">\n                </md-contact-chips>\n            </md-content>\n        </div>\n        <div>\n            <md-button class="md-button md-raised md-primary accent" ng-click="saveGroupDetails()">\n                Save\n            </md-button>\n        </div>\n    \n    </md-content>\n</div>');
$templateCache.put('/modules/groups/group.html','<div  ng-controller="groupController" layout="column" >\n    \n    <div layout="column" class="view-animate-container">\n        <span>{{message}}</span>\n        <!--group views-->\n        <div ui-view class="view-animate">\n            \n        </div>\n        \n    </div>    \n</div>');
$templateCache.put('/modules/groups/groups.html','<div class="" ng-controller="groupsController" cg-busy="promises.init">\n\t<nav class="navbar navbar-inverse navbar-fixed-top fixed-top sticky-top bg-primary">\n\t\t<a class="navbar-brand" href="">Groups <span ng-show="groupList.length > 0" class="badge">({{groupList.length}})</span></a>\n\t\t<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"\n\t\t aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\n\t\t\t<span class="navbar-toggler-icon"></span>\n\t\t</button>\n\t</nav>\n\t<div class="" role="main">\n\t\t<ul class="list-group" >\n\t\t\t<li ng-repeat="g in groupList" ng-click="openBoard(g)" class="list-group-item list-group-item-action flex-column align-items-start">\n\t\t\t\t<div class="row">\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<img ng-src="{{g.thumbnail || defaultGroupThumbnail}}" class="thumbnail sq sq-sm" />\n\t\t\t\t\t</div>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<div class="">\n\t\t\t\t\t\t\t<h7 class="mb-1">{{g.name}}</h7>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<p class="mb-1">{{g.description}} </p>\n\t\t\t\t\t\t<small class="text-muted">3 days ago</small>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t\t<li class="list-group-item list-group-item-action flex-column align-items-start">\n\t\t\t\t<div class="div-center"><a ng-click="createGroup()">New group</a></div>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n</div>');
$templateCache.put('/modules/landing/landing.html','<div class="vertical-center" ng-controller="landingController">\n    <div class="div-center">\n        <cp-logo size="75"></cp-logo>\n        <h4 >Empower everybody</h4>\n        <p >Communication platform v1</p>\n        <div ng-show="user!=null"  layout="row">\n            <ez-thumb text="user.firstName + \' \' + user.lastName" img="user.Picture"  thumbnail-class="\'avatar\'"> </ez-thumb>\n            <span>{{user.firstName + \' \' + user.lastName}}<span>\n        </div>   \n        <a  class="btn btn-primary" ng-click="startApp()">Start!</a>\n    </div>\n</div>');}]);