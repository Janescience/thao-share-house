<template>

  <CardBox
    v-if="itemsPaginated.length > 0"
    has-table
  >
    <table>
      <thead>
        <tr>
          <th />
          <th>วงแชร์</th>
          <th>ประเภท</th>
          <th>เงินต้น</th>
          <th>รอบการส่งเงิน</th>
          <th>จำนวนมือ</th>
          <th>วันที่เริ่มวง</th>
          <th>วันที่จบวง</th>
          <th>งวดปัจจุบัน</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="group in itemsPaginated"
          :key="group.id"
        >
          <td class="border-b-0 lg:w-6 before:hidden">
            <UserAvatar
              api="bottts"
              :username="group.id"
              class="w-10 h-10 mx-auto lg:w-10 lg:h-10"
            />
          </td>
          <td data-label="วงแชร์">
            {{ group.name }}
          </td>
          <td data-label="ประเภท">
            {{ getType(group.type) }}
          </td>
          <td data-label="เงินต้น">
            {{ formatCurrency(group.amount) }}
          </td>
          
          <td data-label="รอบการส่งเงิน">
            {{ group.payRound }} วัน
          </td>
          <td data-label="จำนวนมือ">
            {{ group.numOfPlayer }}
          </td>
          <td 
            data-label="วันที่เริ่มวง"
            class="lg:w-1 whitespace-nowrap"
          >
            {{ formatDate(group.startDate) }}
          </td>
          <td 
            data-label="วันที่จบวง"
            class="lg:w-1 whitespace-nowrap"
          >
            {{ formatDate(group.endDate) }}
          </td>
          <td data-label="งวดปัจจุบัน">
            {{ group.period }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons
              type="justify-start lg:justify-end"
              no-wrap
            >
              <BaseButton
                color="info"
                icon=""
                label="รายละเอียด"
                
                @click="$router.push({name:'group-detail',params:{id:group.id}})"
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
</template>

<script>
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import moment from 'moment'
import CardBox from './CardBox.vue'
import numeral from 'numeral'
import {getGroupType,getGroupStatus} from '@/constants/group'

export default {
    data() {
        return {
          perPage : 10,
          currentPage : 0
        }
    },
    props : {
      items : {
        type : Array,
        default : []
      }
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
      formatCurrency(amt){
        return numeral(amt).format(0,0)
      },
      formatDate(date){
        if(!date){
          return ""
        }
        return moment(new Date(date)).format('DD/MM/YYYY');
      },
      getType(type){
        return getGroupType(type);
      },
      getStatus(status,actionDate){
            let today = new Date().setHours(0,0,0,0);
            let actDate = new Date(actionDate).setHours(0,0,0,0);
            if(status === 'P' && (today === actDate)){
                return 'วงวันนี้'
            }
            return getGroupStatus(status);
      }
    },
    components : {
      BaseLevel,
      BaseButtons,
      BaseButton,
      UserAvatar,
      CardBox
    }
}
</script>
