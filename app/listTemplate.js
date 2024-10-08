const listTemplate = `
  <div id="contentTypesContainer">
  <h1 id="top">{{h1}}</h1>
  <div class="row events-container">
    <div class="col-lg-8">
    <nav
      v-if="pages.length > 1"
      role="navigation"
      aria-label="Results data navigation"
    >
      <ol class="pagination d-flex flex-wrap my-2 ms-0">
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="First"
            :class="{ disabled: !pageIndex }"
            @click="goToPage(0)"
          >
            First
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Previous"
            :class="{ disabled: !pageIndex }"
            @click="goToPage(pageIndex - 1)"
          >
            Previous
          </button>
        </li>
        <li class="page-item mb-2 rounded disabled current">
          <button class="page-link rounded" type="button">
            {{ pageIndex + 1 }}
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Next"
            :class="{ disabled: pageIndex + 1 === pages.length }"
            @click="goToPage(pageIndex + 1)"
          >
            Next
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Last"
            :class="{ disabled: pageIndex === pages.length - 1 }"
            @click="goToPage(pages.length - 1)"
          >
            Last
          </button>
        </li>
      </ol>
    </nav>
    <p>
      <span 
        >Total results:
        {{
          pages.reduce((acc, p) => {
            return acc + p.length;
          }, 0)
        }}.&nbsp;</span
      >
      <span v-if="pages.length > 1"
        >Viewing page {{ pageIndex + 1 }} of {{ pages.length }}.</span
      >
    </p>
      <div v-for="(_, i) in pages" :key="i" v-show="i===pageIndex">
        <div
          v-for="item in pages[i]"
          v-bind:key="item.sys.id"
          v-on:keyup.enter="click_me(item.sys.id)"
          tabindex="0"
          class="linkDiv ranger-event-card card card-item flex-md-row align-items-center"
        >
          <a :href="item.sys.uri"
            ><span class="innerLink" :id="item.sys.id"
              ><span class="visually-hidden">{{item.title}} | {{item.startDate}}</span></span
            ></a
          >
          <div
            class="col-12 col-md-5 thumbnail-container d-flex justify-content-center pt-2 pt-md-0 px-2"
          >
            <img
              v-if="item.image !=null"
              class="img-fluid rounded featured-img"
              v-bind:src="item.image.asset.sys.uri + '?format=webp'"
              v-bind:alt="item.title"
            />
          </div>
          <div
            class="card-body col-12 col-md-7 text-center text-md-start ps-md-4 ps-xl-2"
          >
            <h2 class="fs-4">{{item.entryTitle}}</h2>
            <template v-if="item.startDate===item.endDate ">
              <p>{{item.startDate}}.</p>
              <p>Time:{{item.startTime}}&nbsp;-{{item.endTime}}.</p></template
            >
            <template v-else>
              <p>From{{item.startTime}}&nbsp;on&nbsp;{{item.startDate}}.</p>
              <p>
                Until{{item.endTime}}&nbsp;on&nbsp;{{item.endDate}}.
              </p></template
            >
            <p>{{item.excerpt}}</p>
          </div>
        </div>
      </div>
    <nav
      v-if="pages.length > 1"
      role="navigation"
      aria-label="Results data navigation"
    >
      <ol class="pagination d-flex flex-wrap my-2 ms-0">
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="First"
            :class="{ disabled: !pageIndex }"
            @click="goToPage(0)"
          >
            First
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Previous"
            :class="{ disabled: !pageIndex }"
            @click="goToPage(pageIndex - 1)"
          >
            Previous
          </button>
        </li>
        <li class="page-item mb-2 rounded disabled current">
          <button class="page-link rounded" type="button">
            {{ pageIndex + 1 }}
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Next"
            :class="{ disabled: pageIndex + 1 === pages.length }"
            @click="goToPage(pageIndex + 1)"
          >
            Next
          </button>
        </li>
        <li class="page-item mb-2">
          <button
            class="page-link rounded"
            type="button"
            aria-label="Last"
            :class="{ disabled: pageIndex === pages.length - 1 }"
            @click="goToPage(pages.length - 1)"
          >
            Last
          </button>
        </li>
      </ol>
    </nav>
    </div>
    <div class="col-lg-4 mt-0 mt-lg-5">
      <div
        class="search-options-container border-secondary border border-1 rounded p-3 mt-lg-4"
      >
        <h2 class="mt-0">Search for an event</h2>
        <div class="date-range">
          <h3>Date range</h3>
          <label for="start-date">From</label>
          <input
            type="date"
            id="start-date"
            v-model="fromDate"
            min="2022-09-01"
            max="2025-12-31"
          />
          <label for="end-date">To</label>
          <input
            type="date"
            id="end-date"
            v-model="toDate"
            min="2022-09-01"
            max="2025-12-31"
            v-on:change="searchFilter()"
          />
        </div>
        <div class="search-options mt-3">
          <div class="input-group content-type-search">
            <input
              @input="searchFilter"
              @focus="clearAlert"
              autocomplete="off"
              type="text"
              class="form-control me-2 border-secondary border border-1"
              placeholder="Type here..."
              v-model="searchTerm"
              aria-label="Search term"
              id="contentTypeSearchInput"
            />
            <div class="input-group-append">
              <button
                type="button"
                class="btn btn-outline-secondary"
                v-on:click="searchFilter"
                id="contentTypeSearchBtn"
              >
                Search
              </button>
            </div>
            <button
              class="btn btn-outline-secondary w-100 mt-3"
              type="button"
              v-on:click="resetSearch"
            >
              Clear
            </button>
          </div>
          <div class="search-error-messages">
            <div
              v-if="searchAlert===true"
              class="alert alert-secondary mt-2"
              role="alert"
            >
              Please enter a search term.
            </div>
          </div>
        </div>
      </div>
      <div class="category-options pt=5 mt-5">
        <h3 class="mb-3">Or filter events by category</h3>
        <div
          class="form-check"
          v-for="category in categories"
          v-bind:key="category"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-bind:id="category"
            v-bind:ref="category"
            v-bind:checked="categoriesChecked.includes(category)"
            v-on:change=" ()=>{applyFilters(category);}"
          />
          <label class="form-check-label" v-bind:for="category"
            >{{category}}</label
          >
        </div>
      </div>
    </div>
  </div>
</div>
  `;

export default listTemplate;
