<template>
  <LayoutAuthenticated>
      <SectionMain>
        <section class="px-6 sm:px-0 mb-6 flex items-center justify-between">
          <div class="flex items-center justify-start">
            <h1 class="text-2xl">
              ลูกแชร์
            </h1>
          </div>
          <FormControl
              v-model="searchMember"
              icon="accountSearchOutline"
              class="shadow"
              placeholder="ค้นหาลูกแชร์"
          />
        </section>
        <CardBoxModal
            v-model="modalConfirm"
            title="ยืนยันอีกครั้ง"
            button-label="ยืนยัน"
            @confirm="funcConfirm"
            has-cancel
            >
            <p>{{ textConfirm }}</p>
        </CardBoxModal>

        <CardBox
            v-if="itemsPaginated.length > 0"
            :title="'รายการลูกแชร์ ' + countChecked()"
            class="shadow-lg"
            has-table
            header-icon=""
        >
            <div
            class="p-3 bg-gray-100/50 dark:bg-gray-800"
            >
                <div  v-if="checkedRows.length == 0" class="flex mb-1">
                    <FormControl
                        v-model="addMember"
                        icon="accountSearchOutline"
                        class="shadow mr-2 lg:w-64"
                        
                        placeholder="กรอกชื่อเพื่อสร้างลูกแชร์"
                    />
                    <BaseButtons
                    type="justify-end lg:justify-start"
                    no-wrap
                    >
                        <BaseButton
                            :disabled="addMember === ''"
                            color="success"
                            label="สร้างลูกแชร์"
                            
                            icon=""
                            @click="createMember()"
                        />
                    </BaseButtons>
                    <NotificationBar
                      v-if="createError"
                      color="warning"
                      icon="alertCircleOutline"
                    >
                      {{ createError }}
                      <template #right>
                        <BaseButton
                          icon="close"
                          label=""
                          color="danger"
                          small
                          @click="createError = ''"
                        />
                      </template>
                    </NotificationBar>
                </div>
                <div v-else >
                    <span
                        v-for="checkedRow in checkedRows"
                        :key="checkedRow.id"
                        class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-gray-700 mb-1"
                    >
                        {{ checkedRow.name }}
                    </span>
                    
                    <BaseButtons
                        type="justify-start lg:justify-end"
                        no-wrap
                    >
                        <BaseButton
                    
                        color="danger"
                        label="ลบลูกแชร์ทั้งหมด"
                        icon="trashCanOutline"
                        small
                        @click="isModalActive = true"
                        />
                    </BaseButtons>
                </div>
                
                    
            </div>

            <table>
            <thead>
                <tr >
                    <th />
                    <th />
                    <th class="text-center" >ชื่อ</th>
                    <th class="text-center">สถานะ </th>
                    <th />
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="member in itemsPaginated"
                :key="member.id"
                >
                    <TableCheckboxCell
                        v-if="member.status === 'N'"
                        :isChecked="member.checked"
                        class="text-center border-b-0 lg:w-6 before:hidden"
                        @checked="checked($event, member)"
                    />
                    <td class="border-b-0 lg:w-10 before:hidden"/>
                    <td class="border-b-0 lg:w-6 before:hidden">
                        <UserAvatar
                        :username="member.id"
                        class="w-12 h-12 mx-auto lg:w-12 lg:h-12"
                        />
                    </td>
                    <td data-label="ชื่อ">
                        <FormControl
                            v-if="member.edit"
                            v-model="member.nameEdit"
                            icon="pencilOutline"
                            class="shadow-lg w-48"
                            :placeholder="member.name"
                        />
                        <span v-else>{{ member.name }}</span>
                    </td>
                    <td data-label="สถานะ">
                        <span> {{ member.status == "Y" ? "เล่น " + member.numberOfGroup + " วง" : "ว่าง" }} </span>
                    </td>
                    <td class="lg:w-6 whitespace-nowrap">
                        <BaseButtons
                        type="justify-end lg:justify-start"
                        no-wrap
                        v-if="!member.edit"
                        >
                            <BaseButton
                                :disabled="member.status !== 'N'"
                                color="danger"
                                label=""
                                icon="trashCanOutline"
                                
                                @click="confirm(
                                    'ยืนยันลบลูกแชร์ '+member.name+' ใช่หรือไม่ ?',
                                    member.id,
                                    deleteMember
                                )"
                            />
                            <BaseButton
                                color="warning"
                                label=""
                                icon="accountEditOutline"
                                
                                @click="edit(member.id)"
                            />
                            <BaseButton
                                color="info"
                                label=""
                                icon="accountDetailsOutline"
                                
                                @click="detail(member.id)"
                            />
                        </BaseButtons>
                        <BaseButtons
                        type="justify-start"
                        no-wrap
                        v-else
                        >
                            <BaseButton
                                color="success"
                                label=""
                                icon="contentSaveOutline"
                                
                                @click="update(member)"
                            />
                            <BaseButton
                                color="danger"
                                label=""
                                icon="close"
                                
                                @click="cancelEdit(member)"
                            />
                            
                        </BaseButtons>
                    </td>
                </tr>
            </tbody>
            </table>
            <div
            class="p-3 lg:px-6 border-t border-gray-100 dark:border-gray-800"
            >
              <BaseLevel>
                  <BaseButtons>
                  <BaseButton
                      v-for="page in pagesList"
                      :key="page"
                      :active="page === currentPage"
                      :label="page + 1"
                      small
                      @click="currentPage = page"
                  />
                  </BaseButtons>
                  <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
              </BaseLevel>
            </div>
        </CardBox>
        <CardBox v-else empty/>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleBar from '@/components/SectionTitleBar.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import CardBox from '@/components/CardBox.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import FormControl from '@/components/FormControl.vue'
import NotificationBar from '@/components/NotificationBar.vue'

import MemberService from '@/services/member'

export default {
    data(){
        return {
            titleStack : ['ลูกแชร์'],
            textConfirm : "",
            modalConfirm : false,
            funcConfirm : Function,
            idConfirm : null,
            perPage :10,
            currentPage : 0,
            checkedRows : [],
            items : [],
            searchMember : "",
            addMember : "",
            createError : ""
        }
    },
    watch : {
      searchMember (value) {
        this.getMembers(value)
      }
    },
    created() {
      this.getMembers()
    },
    computed : {
      itemsPaginated() {
        return this.items ? this.items.slice(this.perPage * this.currentPage, this.perPage * (this.currentPage + 1)) : []
      },
      numPages(){
        return Math.ceil((this.items ? this.items.length : 0) / this.perPage);
      },
      currentPageHuman() {
        return this.currentPage + 1
      },
      pagesList() {
        const pagesList = []

        for (let i = 0; i < this.numPages; i++) {
          pagesList.push(i)
        }

        return pagesList
      }
    },
    methods: {
      async getMembers(searchMember = ""){
        let loader = this.$loading.show();
        const resp = await MemberService.getAll(searchMember);
        if(resp.data){
          this.items = resp.data.data
          loader.hide()
        }
      },
      async deleteMember(){
        let loader = this.$loading.show();
        const resp = await MemberService.delete(this.idConfirm);
        if(resp.data){
            this.idConfirm = null
            this.getMembers()
            loader.hide()
        }
      },
      createMember(){
        this.createError = ""
        this.items.map((item) => {
          if(item.name === this.addMember){
            this.createError = "มีชื่อลูกแชร์นี้อยู่แล้ว กรุณาใช้ชื่ออื่น"
          }
        })
        if(this.createError === ""){
          let loader = this.$loading.show();
          MemberService.create({name:this.addMember}).then(
            (resp) => {
              if(resp.data){
                this.getMembers()
                this.addMember = ""
                MemberService.all()
                loader.hide()
              }
            }
          );
        }
      },
      update(member){
        this.createError = ""
        this.items.map((item) => {
          if(item.name === member.nameEdit){
            this.createError = "มีชื่อลูกแชร์นี้อยู่แล้ว กรุณาใช้ชื่ออื่น"
          }
        })
        if(this.createError === ""){
          let loader = this.$loading.show();
          MemberService.update(member.id,member.nameEdit).then(
            (resp) => {
              if(resp.data){
                this.getMembers()
                member.edit = false
                loader.hide()
              }
            }
          )
          
        }
      },
      edit(memberId){
        this.items.map((item) => {
            if(item.id === memberId){
                item.edit = true
            }
        })
      },
      cancelEdit(member){
        member.edit = false
      },
      detail(memberId){
        this.$router.push({
                name :"member-detail",
                params: {
                    id: memberId
                }
              })
      },
      countChecked(){
        return (this.checkedRows.length > 0 ? '(เลือก ' + this.checkedRows.length + ' รายการ)':'('+ this.items.length +' รายการ)')
      },
      checked(isChecked, member){
        if (isChecked) {
          member.checked = true
          this.checkedRows.push(member)
        } else {
           member.checked = false
          this.checkedRows = this.remove(this.checkedRows, row => row.id === member.id)
        }
      },
      remove(arr,cb){
        const newArr = []
        arr.forEach(item => {
          if (!cb(item)) {
            newArr.push(item)
          }
        })
        return newArr
      },
      confirm(text,memberId,func){
        this.textConfirm = text
        this.funcConfirm = func
        this.idConfirm = memberId
        this.modalConfirm = true
      },
      formatCurrency(amt){
        return numeral(amt).format(0,0)
      }
    },
    components : {
        LayoutAuthenticated,
        SectionMain,
        SectionTitleBar,
        CardBoxModal,
        TableCheckboxCell,
        BaseLevel,
        BaseButtons,
        BaseButton,
        UserAvatar,
        CardBox,
        FormControl,
        BaseIcon,
        NotificationBar
    }
}
</script>