<template>
  <LayoutAuthenticated>
    <SectionTitleBar :title-stack="titleStack" />
    <SectionMain>
        <CardBoxModal
            v-model="modalConfirm"
            title="ยืนยันอีกครั้ง"
            button-label="ยืนยัน"
            @confirm="funcConfirm"
            has-cancel
            >
            <p>{{ textConfirm }}</p>
        </CardBoxModal>

        <div class="grid lg:grid-cols-2 gap-3">
            <CardBox >
            <BaseLevel type="justify-around lg:justify-center">
                <UserAvatarCurrentUser class="lg:mx-6 w-24" :username="$route.params.id"/>
                <div class="space-y-3 text-center md:text-left lg:mx-12">
                <h1 class="text-2xl">
                    <PillTag
                    :text="member.name"
                    type="light"
                    icon="account"
                />
                </h1>
                <p >ยอดค้างส่งรวม <b class="text-blue-500 text-xl"><u>{{ formatCurrency(sum().debt) }}</u></b> บาท</p>
                <p >จ่ายแล้วรวม <b class="text-emerald-500 text-xl"><u>{{ formatCurrency(sum().paid) }}</u></b> บาท</p>
                <p >เหลือยอดค้างส่งรวม <b class="text-red-500 text-xl"><u>{{ formatCurrency(sum().balance) }}</u></b> บาท</p>
                
                </div>
            </BaseLevel>
            </CardBox>
            <CardBox >
            <p v-if="checkedRows.length > 0" >เลือก {{ checkedRows.length }} วงแชร์</p>
            <p v-else class="items-center">ถ้าต้องการเคลียร์ยอดค้างทั้งหมดพร้อมกันหลายวงแชร์ กรุณาเลือกวงแชร์</p>
            <div
                class="p-2 dark:bg-gray-800 rounded"
                v-if="checkedRows.length > 0"
            >

                <span
                v-for="checkedRow in checkedRows"
                :key="checkedRow.groupId"
                class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-gray-700 mb-1"
                >
                {{ checkedRow.name }}
                </span>
                <table>
                <tbody>
                    <tr
                    >
                    <td >
                        <span class="justify-start">เหลือยอดค้างส่งรวม : </span>
                        <b class="text-red-500 " ><u>{{ formatCurrency(checkedSum().sumDebt) }}</u></b>
                    </td>
                    <td class="before:hidden lg:w-6 whitespace-nowrap">
                        <BaseButtons
                        type="justify-start lg:justify-end"
                        no-wrap
                        >
                        <BaseButton
                            color="success"
                            label="เคลียร์ยอดค้างทั้งหมด"
                            @click="isModalActive = true"
                        />
                        </BaseButtons>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
            </CardBox>
        </div>
        
        <FormControl
          v-model="searchGroup"
          icon="homeOutline"
          class="mb-3 shadow mt-3 w-full lg:w-64"
          placeholder="ค้นหาวงแชร์"
        />
        
        <CardBox
            v-if="itemsPaginated.length > 0"
            title="รายการวงแชร์ที่มียอดค้าง"
            class="shadow-lg "
            has-table
            header-icon=""
        >
            <div class="overflow-x-auto relative">

            <table >
            <thead>
                <tr>
                <th />
                <th />
                <th >วงแชร์</th>
                <th>ประเภท</th>
                <th>เงินต้น</th>
                <th>จำนวนงวดที่ค้าง</th>
                <th>จำนวนมือ</th>
                <th>ยอดค้าง</th>
                <th>ค่าปรับ</th>
                <th>ค่าดูแล</th>
                <th>จ่ายแล้ว</th>
                <th>เหลือจ่าย</th>
                <th />
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="group in itemsPaginated"
                :key="group.groupId"
                >
                <TableCheckboxCell
                    v-if="(group.amountSend + group.fine + group.careFee) - group.paid > 0"
                    :isChecked="group.checked"
                    class="text-center border-b-0 lg:w-6 before:hidden"
                    @checked="checked($event, group)"
                />
                <td v-else/>
                <td class="border-b-0 lg:w-6 before:hidden">
                    <UserAvatar
                    api="bottts"
                    :username="group.groupId"
                    class="w-10 h-10 mx-auto lg:w-10 lg:h-10"
                    />
                </td>
                <td data-label="วงแชร์" class="whitespace-nowrap">
                    <span >{{ group.name }}</span>
                </td>
                <td data-label="ประเภท" class="whitespace-nowrap">
                    {{ getType(group.type) }}
                </td>
                <td data-label="เงินต้น" class="text-right whitespace-nowrap">
                    <b ><u>{{ formatCurrency(group.amount) }}</u></b>
                </td>
                <td data-label="ค้างส่งยอด/งวด" class="whitespace-nowrap">
                    {{ group.numPeriod }}
                </td>
                <td data-label="จำนวนมือ" class="whitespace-nowrap">
                    {{ group.numHand }}
                </td>
                <td data-label="ยอดค้าง" class="text-right whitespace-nowrap">
                    <b class="text-blue-500 " ><u>{{ formatCurrency(group.amountSend) }}</u></b>
                </td>
                <td data-label="ค่าปรับ" class="text-right whitespace-nowrap">
                    <b class="text-blue-500 " ><u>{{ formatCurrency(group.fine) }}</u></b>
                </td>
                <td data-label="ค่าดูแล" class="text-right whitespace-nowrap">
                    <b class="text-blue-500 " ><u>{{ formatCurrency(group.careFee) }}</u></b>
                </td>
                <td data-label="จ่ายแล้ว" class="text-right whitespace-nowrap lg:w-6">
                    <FormControl
                      type="number"
                      v-model="group.paid"
                      class="shadow w-36"
                      placeholder="จ่ายแล้ว"
                    />
                </td>
                <td data-label="เหลือจ่าย" class="text-right">
                    <b class="text-red-500 " ><u>{{ formatCurrency((group.amountSend + group.fine + group.careFee) - group.paid) }}</u></b>
                </td>
                <td class="lg:w-6 whitespace-nowrap">
                    <BaseButtons
                    type="lg:justify-start justify-end"
                    no-wrap
                    >
                    <BaseButton
                        v-if="(group.amountSend + group.fine + group.careFee) - group.paid > 0 "
                        color="info"
                        label="บันทึก"
                        :disabled="group.paid == '' || (group.paid > (group.amountSend + group.fine + group.careFee))"
                        @click="confirm(
                            'ยืนยันบันทึกรายการของ '+group.name+' ใช่หรือไม่ ?',
                            group.groupId,
                            group.paid,
                            paid
                        )"
                    />
                    <BaseButton
                        v-if="(group.amountSend + group.fine + group.careFee) - group.paid == 0 "
                        color="success"
                        label="เสร็จสิ้น"                        
                        @click="confirm(
                            'ยืนยันเสร็จสิ้นรายการยอดค้างของ '+group.name+' ใช่หรือไม่ ?',
                            group.id,
                            complete
                        )"
                    />
                    </BaseButtons>
                </td>
                </tr>
            </tbody>
            </table>
            </div>
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
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import FormControl from '@/components/FormControl.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import PillTag from '@/components/PillTag.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'

import DebtService from '@/services/debt'
import MemberService from '@/services/member'
import {getGroupType} from '@/constants/group'

import numeral from 'numeral'
import moment from 'moment'

export default {
    data(){
        return {
            titleStack : ['ยอดค้างจ่าย','รายละเอียด'],
            textConfirm : "",
            modalConfirm : false,
            funcConfirm : Function,
            idConfirm : null,
            paidConfirm : null,
            perPage :5,
            currentPage : 0,
            items : [],
            checkedRows : [],
            searchGroup : "",
            member : {}
        }
    },
    watch : {
      searchGroup (value) {
        this.getDebtDetail(value)
      }
    },
    created() {
      this.getDebtDetail()
      this.getMember()
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
      async getDebtDetail(searchGroup = ""){
        let loader = this.$loading.show();
        const resp = await DebtService.getDebtDetail({memberId:this.$route.params.id,search:searchGroup});
        if(resp.data){
          this.items = resp.data.data
          loader.hide()
        }
      },
      async paid(){
          let loader = this.$loading.show();
          const resp = await DebtService.paidGroup(this.$route.params.id,this.idConfirm,this.paidConfirm);
          if(resp.data){
              this.idConfirm = null
              this.paidConfirm = null
              this.getDebtDetail()
              loader.hide()
          }
      },
      async complete(){
        let loader = this.$loading.show();
        const resp = await DebtService.complete(this.idConfirm);
        if(resp.data){
            this.idConfirm = null
            this.getDebts()
            loader.hide()
        }
      },
      async getMember(){
        let loader = this.$loading.show();
        const resp = await MemberService.get(this.$route.params.id);
        if(resp.data){
            this.member = resp.data.data
            loader.hide()
        }
      },
      limitPaid(group){
        if(group.paid > (group.amountSend + group.fine + group.careFee)){
          group.paid = (group.amountSend + group.fine + group.careFee)
        }
      },
      sum(){
        let sumDebt = 0;
        let sumPaid = 0;
        let sumBalance = 0;
        this.items.map((item) => {
          sumDebt += (item.amountSend + item.fine + item.careFee)
          sumPaid += item.paid;
          sumBalance += sumDebt - sumPaid
        })
        return {debt:sumDebt,paid:sumPaid,balance:sumBalance};
      },
      checked(isChecked, group){
        if (isChecked) {
          group.checked = true
          this.checkedRows.push(group)
        } else {
           group.checked = false
          this.checkedRows = this.remove(this.checkedRows, row => row.groupId === group.groupId)
        }
      },
      checkedSum(){
        let sumAmountSend = 0,sumDebt = 0,sumPaid = 0;
        this.checkedRows.map((row) => {
            sumAmountSend += (row.amountSend + row.fine + row.careFee);
            sumPaid += row.paid;
            sumDebt += (sumAmountSend - sumPaid);
        })
        return {
          sumAmountSend,
          sumPaid,
          sumDebt
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
      confirm(text,id,paid,func){
        this.textConfirm = text
        this.funcConfirm = func
        this.idConfirm = id
        this.paidConfirm = paid
        this.modalConfirm = true
      },
      formatCurrency(amt){
        return numeral(amt).format(0,0)
      },
      formatDate(date){
        return moment(new Date(date)).format('DD/MM/YYYY');
      },
      getType(type){
        return getGroupType(type);
      }
    },
    components : {
        LayoutAuthenticated,
        SectionMain,
        SectionTitleBar,
        CardBoxModal,
        BaseLevel,
        BaseButtons,
        BaseButton,
        UserAvatar,
        CardBox,
        FormControl,
        UserAvatarCurrentUser,
        PillTag,
        TableCheckboxCell
    }
}
</script>